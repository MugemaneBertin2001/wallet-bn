import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED',
  TRANSACTION_ALERT = 'TRANSACTION_ALERT',
  SYSTEM_ALERT = 'SYSTEM_ALERT'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column('jsonb', { nullable: true })
  data?: any;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}