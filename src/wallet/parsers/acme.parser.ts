import { Injectable } from '@nestjs/common';
import { BankParser, ParsedTransaction } from './bank-parser.interface.js';

@Injectable()
export class AcmeParser implements BankParser {
  parse(rawPayload: string): ParsedTransaction[] {
    const lines = rawPayload.trim().split(/\r?\n/).filter(Boolean);

    return lines.map((line) => {
      const parts = line.split('//').map((p) => p.trim());
      if (parts.length < 3) {
        throw new Error(`Malformed Acme line: ${line}`);
      }

      const amount = parseFloat(parts[0].replace(',', '.'));
      const reference = parts[1];
      const dateStr = parts[2];

      const year = parseInt(dateStr.substring(0, 4), 10);
      const month = parseInt(dateStr.substring(4, 6), 10) - 1;
      const day = parseInt(dateStr.substring(6, 8), 10);

      return {
        date: new Date(Date.UTC(year, month, day)),
        amount,
        reference,
      };
    });
  }
}