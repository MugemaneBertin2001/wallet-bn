import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';

@Module({
 imports: [
   TypeOrmModule.forFeature([Budget]),
 ],
 controllers: [BudgetsController],
 providers: [BudgetsService],
 exports: [BudgetsService], 
})
export class BudgetsModule {}