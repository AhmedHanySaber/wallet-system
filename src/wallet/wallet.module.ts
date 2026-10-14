import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller.js';
import { WalletService } from './wallet.service.js';
import { Client } from './entities/client.entity.js';
import { Transaction } from './entities/transaction.entity.js';
import { WebhookJob } from './entities/webhook-job.entity.js';
import { PaytechParser } from './parsers/paytech.parser.js';
import { AcmeParser } from './parsers/acme.parser.js';
import { PaymentXmlBuilder } from './xml/payment-xml.builder.js';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Transaction, WebhookJob])],
  controllers: [WalletController],
  providers: [WalletService, PaytechParser, AcmeParser, PaymentXmlBuilder],
})
export class WalletModule {}