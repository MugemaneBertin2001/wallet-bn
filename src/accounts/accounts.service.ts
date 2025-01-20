import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

import { BaseService } from '../common/base/base.service';
import { CreateAccountDto } from './entities/dto/create-account.dto';
import { UpdateAccountDto } from './entities/dto/update-account.dto';

@Injectable()
export class AccountsService extends BaseService<Account> {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {
    super(accountsRepository);
  }

  async createAccount(userId: string, createAccountDto: CreateAccountDto): Promise<Account> {
    const account = this.accountsRepository.create({
      ...createAccountDto,
      userId,
    });
    return this.accountsRepository.save(account);
  }

  async findUserAccounts(userId: string): Promise<Account[]> {
    return this.accountsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateAccount(id: string, userId: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    await this.accountsRepository.update(
      { id, userId }, 
      updateAccountDto
    );
    return this.findOne(id);
  }
  async updateBalance(id: string,userId, balanceChange): Promise<Account> {
    await this.accountsRepository.update(
      { id,userId }, 
      balanceChange
    );
    return this.findOne(id);
  }

  async deleteAccount(id: string, userId: string): Promise<void> {
    await this.accountsRepository.delete({ id, userId });
  }
}