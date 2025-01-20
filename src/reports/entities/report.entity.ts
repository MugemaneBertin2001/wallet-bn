import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReportType {
  TRANSACTION = 'TRANSACTION',
  CATEGORY = 'CATEGORY',
  BUDGET = 'BUDGET',
  SUMMARY = 'SUMMARY'
}

export enum ReportPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM'
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ReportType
  })
  type: ReportType;

  @Column({
    type: 'enum',
    enum: ReportPeriod
  })
  period: ReportPeriod;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column('jsonb', { nullable: true })
  filters?: any;

  @Column('jsonb')
  data: any;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}