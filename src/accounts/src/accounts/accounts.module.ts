import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import { AccountsController } from 'src/accounts/accounts.controller';
import { Account } from 'src/accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}