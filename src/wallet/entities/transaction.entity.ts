import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, CreateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Client } from './client.entity.js';

@Entity('transactions')
@Unique(['bankReference'])
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column()
  bankReference: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, string>;

  @ManyToOne(() => Client, (client) => client.transactions)
  client: Relation<Client>;

  @CreateDateColumn()
  createdAt: Date;
}