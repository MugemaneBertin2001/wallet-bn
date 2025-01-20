import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionSource } from '../enums/transaction-source.enum';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({
    type: 'enum',
    enum: TransactionSource
  })
  source: TransactionSource;

  // For Mobile Money tracking
  @Column({ nullable: true })
  phoneNumber?: string;

  // For Bank tracking
  @Column({ nullable: true })
  bankAccountNumber?: string;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  // Reference to external transaction IDs
  @Column({ nullable: true })
  externalReference?: string;
}