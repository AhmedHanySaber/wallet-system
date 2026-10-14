import { Controller, Post, Body, Param, Query, Header } from '@nestjs/common';
import { WalletService } from './wallet.service.js';
import { TransferRequestDto } from './dto/transfer-request.dto.js';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // POST /wallet/webhook/:bank?clientId=...
  @Post('webhook/:bank')
  async receiveWebhook(
    @Param('bank') bank: string,
    @Query('clientId') clientId: string,
    @Body() rawPayload: string,
  ) {
    return this.walletService.bufferWebhook(bank, clientId, rawPayload);
  }

  // POST /wallet/ingestion/toggle?active=true|false
  @Post('ingestion/toggle')
  toggleIngestion(@Query('active') active: string) {
    const isActive = active === 'true';
    return this.walletService.setIngestionState(isActive);
  }

  // POST /wallet/ingestion/process-pending
  @Post('ingestion/process-pending')
  processPending() {
    return this.walletService.processPendingJobs();
  }

  // POST /wallet/transfer/xml
  @Post('transfer/xml')
  @Header('Content-Type', 'application/xml')
  generateTransferXml(@Body() dto: TransferRequestDto): string {
    return this.walletService.createTransferXml(dto);
  }
}