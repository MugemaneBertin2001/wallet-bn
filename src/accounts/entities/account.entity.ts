import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum AccountType {
  BANK = 'BANK',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CASH = 'CASH'
}

@Entity('accounts')
export class Account {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ enum: AccountType })
  @Column({
    type: 'enum',
    enum: AccountType,
  })
  type: AccountType;

  @ApiProperty()
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @ApiProperty()
  @Column({ length: 3, default: 'USD' })
  currency: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}