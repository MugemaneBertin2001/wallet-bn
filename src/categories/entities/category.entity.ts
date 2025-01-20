import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CategoryType
  })
  type: CategoryType;

  @Column({ name: 'parent_id', nullable: true })
  parentId?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}