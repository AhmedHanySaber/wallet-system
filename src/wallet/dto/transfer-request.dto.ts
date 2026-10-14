export class TransferRequestDto {
  reference: string;
  date: string;
  amount: number;
  currency: string;
  senderAccount: string;
  receiverBankCode: string;
  receiverAccount: string;
  beneficiaryName: string;
  notes?: string[];
  paymentType?: string;
  chargeDetails?: string;
}
