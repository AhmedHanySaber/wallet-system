import { Injectable } from '@nestjs/common';
import { BankParser, ParsedTransaction } from './bank-parser.interface.js';

@Injectable()
export class PaytechParser implements BankParser {
  parse(rawPayload: string): ParsedTransaction[] {
    const lines = rawPayload.trim().split(/\r?\n/).filter(Boolean);

    return lines.map((line) => {
   
      const parts = line.split('#');
      if (parts.length < 2) {
        throw new Error(`Malformed PayTech line: ${line}`);
      }

    
      const dateStr = parts[0].substring(0, 8);
      const rawAmount = parts[0].substring(8).replace(',', '.');
      const amount = parseFloat(rawAmount);

      const reference = parts[1].trim();

  
      const metadata: Record<string, string> = {};
      if (parts[2]) {
        const kvTokens = parts[2].split('/');
        for (let i = 0; i < kvTokens.length; i += 2) {
          if (kvTokens[i] && kvTokens[i + 1]) {
            metadata[kvTokens[i]] = kvTokens[i + 1];
          }
        }
      }

      const year = parseInt(dateStr.substring(0, 4), 10);
      const month = parseInt(dateStr.substring(4, 6), 10) - 1;
      const day = parseInt(dateStr.substring(6, 8), 10);

      return {
        date: new Date(Date.UTC(year, month, day)),
        amount,
        reference,
        metadata,
      };
    });
  }
}