import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { CategoriesModule } from '../categories/categories.module';
import { BudgetsModule } from '../budgets/budgets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    TransactionsModule,
    CategoriesModule,
    BudgetsModule
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService]
})
export class ReportsModule {}