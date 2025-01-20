import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity'; 
import { Category } from '../categories/entities/category.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Budget } from '../budgets/entities/budget.entity';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User,Account,Category,Transaction, Budget],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations_history',
});