import { IsNotEmpty, IsNumber, IsEnum, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BudgetPeriod } from '../entities/budget.entity';

export class CreateBudgetDto {
  @ApiProperty({
    description: 'Category ID for this budget',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'Budget amount',
    example: 500.00
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    enum: BudgetPeriod,
    description: 'Budget period',
    example: BudgetPeriod.MONTHLY
  })
  @IsEnum(BudgetPeriod)
  @IsNotEmpty()
  period: BudgetPeriod;

  @ApiProperty({
    description: 'Start date of the budget',
    example: '2025-01-01'
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the budget (optional)',
    example: '2025-12-31',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}