import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionFilterDto } from './dto/transaction-filter.dto';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private accountsService: AccountsService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    // Verify account belongs to user
    const account = await this.accountsService.findOne(createTransactionDto.accountId);
    if (account.userId !== userId) {
      throw new NotFoundException('Account not found');
    }

    // Create transaction
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      userId,
    });

    // Update account balance
    const balanceChange = createTransactionDto.type === 'INCOME' 
      ? createTransactionDto.amount 
      : -createTransactionDto.amount;
    
    await this.accountsService.updateBalance(
      createTransactionDto.accountId,
      userId,
      balanceChange
    );

    return this.transactionsRepository.save(transaction);
  }

  async findAll(userId: string, filters: TransactionFilterDto): Promise<Transaction[]> {
    const query = this.transactionsRepository.createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('transaction.category', 'category');

    if (filters.startDate && filters.endDate) {
      query.andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    if (filters.accountId) {
      query.andWhere('transaction.accountId = :accountId', {
        accountId: filters.accountId,
      });
    }

    if (filters.categoryId) {
      query.andWhere('transaction.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters.type) {
      query.andWhere('transaction.type = :type', { type: filters.type });
    }

    query.orderBy('transaction.date', 'DESC');

    return query.getMany();
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, userId },
      relations: ['account', 'category'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async update(id: string, userId: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);

    if (updateTransactionDto.amount || updateTransactionDto.type) {
      // Revert old transaction
      const oldBalanceChange = transaction.type === 'INCOME' 
        ? -transaction.amount 
        : transaction.amount;
      
      await this.accountsService.updateBalance(
        transaction.accountId,
        userId,
        oldBalanceChange
      );

      // Apply new transaction
      const newBalanceChange = updateTransactionDto.type === 'INCOME' 
        ? updateTransactionDto.amount 
        : -updateTransactionDto.amount;
      
      await this.accountsService.updateBalance(
        transaction.accountId,
        userId,
        newBalanceChange
      );
    }

    await this.transactionsRepository.update(id, updateTransactionDto);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const transaction = await this.findOne(id, userId);

    // Revert balance change
    const balanceChange = transaction.type === 'INCOME' 
      ? -transaction.amount 
      : transaction.amount;
    
    await this.accountsService.updateBalance(
      transaction.accountId,
      userId,
      balanceChange
    );

    await this.transactionsRepository.delete(id);
  }
}