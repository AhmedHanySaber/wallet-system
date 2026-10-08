import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AuthModule } from './auth/auth.module.js';
import { WalletModule } from './wallet/wallet.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: '2UJeiLjQBiT6OLU^',
    //   appSecret: 'x0H3dSuLZm0kwRiPutrCNb3S9TstgckTUGqQ1U1Xb%YJG',
    //   serviceId: 'wallet-system',
    // }),
    AuthModule,
    WalletModule,
  ],
})
export class AppModule { }
