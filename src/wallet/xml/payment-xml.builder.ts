import { Injectable } from '@nestjs/common';
import { TransferRequestDto } from '../dto/transfer-request.dto.js';

@Injectable()
export class PaymentXmlBuilder {
    build(dto: TransferRequestDto): string {
        const lines: string[] = [];

        lines.push('<?xml version="1.0" encoding="utf-8"?>');
        lines.push('<PaymentRequestMessage>');

        lines.push('  <TransferInfo>');
        lines.push(`    <Reference>${dto.reference}</Reference>`);
        lines.push(`    <Date>${dto.date}</Date>`);
        lines.push(`    <Amount>${dto.amount.toFixed(2)}</Amount>`);
        lines.push(`    <Currency>${dto.currency}</Currency>`);
        lines.push('  </TransferInfo>');


        lines.push('  <SenderInfo>');
        lines.push(`    <AccountNumber>${dto.senderAccount}</AccountNumber>`);
        lines.push('  </SenderInfo>');


        lines.push('  <ReceiverInfo>');
        lines.push(`    <BankCode>${dto.receiverBankCode}</BankCode>`);
        lines.push(`    <AccountNumber>${dto.receiverAccount}</AccountNumber>`);
        lines.push(`    <BeneficiaryName>${dto.beneficiaryName}</BeneficiaryName>`);
        lines.push('  </ReceiverInfo>');

        if (dto.notes && dto.notes.length > 0) {
            lines.push('  <Notes>');
            dto.notes.forEach((n) => lines.push(`    <Note>${this.escapeXml(n)}</Note>`));
            lines.push('  </Notes>');
        }


        if (dto.paymentType && dto.paymentType !== '99') {
            lines.push(`  <PaymentType>${dto.paymentType}</PaymentType>`);
        }

        if (dto.chargeDetails && dto.chargeDetails !== 'SHA') {
            lines.push(`  <ChargeDetails>${dto.chargeDetails}</ChargeDetails>`);
        }

        lines.push('</PaymentRequestMessage>');

        return lines.join('\n');
    }

    private escapeXml(unsafe: string): string {
        return unsafe.replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    }
}