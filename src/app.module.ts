import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from './wallet/wallet.module.js';
import { Client } from './wallet/entities/client.entity.js';
import { Transaction } from './wallet/entities/transaction.entity.js';
import { WebhookJob } from './wallet/entities/webhook-job.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5434'), 10),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'wallet_db'),
        entities: [Client, Transaction, WebhookJob],
        synchronize: true, 
      }),
    }),
    WalletModule,
  ],
})
export class AppModule {}