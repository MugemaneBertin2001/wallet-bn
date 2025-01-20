import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { AccountsModule } from 'src/accounts/src/accounts/accounts.module';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    AccountsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}