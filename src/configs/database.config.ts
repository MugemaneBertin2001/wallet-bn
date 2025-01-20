import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development', 
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_history',
  migrationsRun: true,
  logging: true 
};

export default databaseConfig;