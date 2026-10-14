import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum WebhookStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
}

@Entity('webhook_jobs')
@Index(['status', 'receivedAt'])
export class WebhookJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bank: string;

  @Column()
  clientId: string;

  @Column({ type: 'text' })
  rawPayload: string;

  @Column({ type: 'enum', enum: WebhookStatus, default: WebhookStatus.PENDING })
  status: WebhookStatus;

  @CreateDateColumn()
  receivedAt: Date;
}
