import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
  ) {}

  async create(userId: string, createBudgetDto: CreateBudgetDto): Promise<Budget> {
    // Check for existing active budget
    const existingBudget = await this.findActiveBudget(
      userId, 
      createBudgetDto.categoryId
    );

    if (existingBudget) {
      // Deactivate existing budget
      await this.deactivateBudget(existingBudget.id);
    }

    const budget = this.budgetRepository.create({
      ...createBudgetDto,
      userId,
      spent: 0,
      isActive: true
    });

    return this.budgetRepository.save(budget);
  }

  async findAll(userId: string): Promise<Budget[]> {
    return this.budgetRepository.find({
      where: { userId, isActive: true },
      relations: ['category']
    });
  }

  async findOne(id: string, userId: string): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id, userId },
      relations: ['category']
    });

    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return budget;
  }

  async update(id: string, userId: string, updateBudgetDto: UpdateBudgetDto): Promise<Budget> {
    const budget = await this.findOne(id, userId);
    
    await this.budgetRepository.update(id, updateBudgetDto);
    
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const budget = await this.findOne(id, userId);
    await this.budgetRepository.remove(budget);
  }

  async trackExpense(categoryId: string, amount: number): Promise<void> {
    const budget = await this.findActiveBudgetByCategory(categoryId);
    if (!budget) return;

    const newSpent = Number(budget.spent) + amount;
    await this.budgetRepository.update(budget.id, { spent: newSpent });

    if (newSpent > budget.amount) {
      // Trigger notification (implement later)
      console.log(`Budget exceeded for category ${categoryId}`);
    }
  }

  private async findActiveBudget(userId: string, categoryId: string): Promise<Budget | null> {
    return this.budgetRepository.findOne({
      where: {
        userId,
        categoryId,
        isActive: true
      }
    });
  }

  private async findActiveBudgetByCategory(categoryId: string): Promise<Budget | null> {
    return this.budgetRepository.findOne({
      where: {
        categoryId,
        isActive: true
      }
    });
  }

  private async deactivateBudget(id: string): Promise<void> {
    await this.budgetRepository.update(id, { isActive: false });
  }

  async getBudgetProgress(userId: string): Promise<any[]> {
    const budgets = await this.findAll(userId);

    return budgets.map(budget => ({
      categoryName: budget.category.name,
      budgeted: budget.amount,
      spent: budget.spent,
      remaining: Number(budget.amount) - Number(budget.spent),
      progress: (Number(budget.spent) / Number(budget.amount)) * 100
    }));
  }
}