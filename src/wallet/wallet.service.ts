import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity.js';
import { WebhookJob, WebhookStatus } from './entities/webhook-job.entity.js';
import { Client } from './entities/client.entity.js';
import { PaytechParser } from './parsers/paytech.parser.js';
import { AcmeParser } from './parsers/acme.parser.js';
import { BankParser } from './parsers/bank-parser.interface.js';
import { TransferRequestDto } from './dto/transfer-request.dto.js';
import { PaymentXmlBuilder } from './xml/payment-xml.builder.js';

@Injectable()
export class WalletService {
    private readonly logger = new Logger(WalletService.name);
    private isIngestionRunning = true; // Toggle to stop ingestion without dropping webhooks

    constructor(
        @InjectRepository(Transaction)
        private readonly txRepo: Repository<Transaction>,
        @InjectRepository(WebhookJob)
        private readonly jobRepo: Repository<WebhookJob>,
        @InjectRepository(Client)
        private readonly clientRepo: Repository<Client>,
        private readonly paytechParser: PaytechParser,
        private readonly acmeParser: AcmeParser,
        private readonly xmlBuilder: PaymentXmlBuilder,
    ) { }

    setIngestionState(active: boolean): { ingestionActive: boolean } {
        this.isIngestionRunning = active;
        this.logger.log(`Ingestion processing active: ${active}`);
        return { ingestionActive: this.isIngestionRunning };
    }

    async bufferWebhook(bank: string, clientId: string, rawPayload: string) {
        const job = this.jobRepo.create({
            bank: bank.toLowerCase(),
            clientId,
            rawPayload,
            status: WebhookStatus.PENDING,
        });
        await this.jobRepo.save(job);

        if (this.isIngestionRunning) {
            this.processJob(job.id).catch((err) =>
                this.logger.error(`Job processing failed: ${err.message}`),
            );
        }

        return { message: 'Webhook buffered successfully', jobId: job.id };
    }


    async processJob(jobId: string): Promise<void> {
        if (!this.isIngestionRunning) {
            this.logger.warn(`Ingestion is currently paused. Job ${jobId} remains pending.`);
            return;
        }

        const job = await this.jobRepo.findOne({ where: { id: jobId } });
        if (!job || job.status === WebhookStatus.PROCESSED) return;

        const client = await this.clientRepo.findOne({ where: { id: job.clientId } });
        if (!client) {
            job.status = WebhookStatus.FAILED;
            await this.jobRepo.save(job);
            throw new NotFoundException(`Client ${job.clientId} not found`);
        }

        const parser = this.getParser(job.bank);
        const parsedTransactions = parser.parse(job.rawPayload);

        for (const item of parsedTransactions) {

            await this.txRepo
                .createQueryBuilder()
                .insert()
                .into(Transaction)
                .values({
                    amount: item.amount,
                    bankReference: item.reference,
                    date: item.date,
                    metadata: item.metadata,
                    client: client,
                })
                .orIgnore()
                .execute();
        }

        job.status = WebhookStatus.PROCESSED;
        await this.jobRepo.save(job);
    }

    //  Process all pending when resumed
    async processPendingJobs(): Promise<number> {
        const pendingJobs = await this.jobRepo.find({
            where: { status: WebhookStatus.PENDING },
            order: { receivedAt: 'ASC' },
        });

        for (const job of pendingJobs) {
            if (!this.isIngestionRunning) break;
            await this.processJob(job.id);
        }
        return pendingJobs.length;
    }

    // Generate XML
    createTransferXml(dto: TransferRequestDto): string {
        return this.xmlBuilder.build(dto);
    }

    private getParser(bankName: string): BankParser {
        switch (bankName.toLowerCase()) {
            case 'paytech':
                return this.paytechParser;
            case 'acme':
                return this.acmeParser;
            default:
                throw new Error(`Unsupported bank: ${bankName}`);
        }
    }
}