export interface ParsedTransaction {
  date: Date;
  amount: number;
  reference: string;
  metadata?: Record<string, string>;
}

export interface BankParser {
  parse(rawPayload: string): ParsedTransaction[];
}