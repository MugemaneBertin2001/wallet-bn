import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BudgetPeriod } from '../entities/budget.entity';

export class BudgetFilterDto {
  @ApiProperty({
    required: false,
    enum: BudgetPeriod
  })
  @IsOptional()
  @IsEnum(BudgetPeriod)
  period?: BudgetPeriod;

  @ApiProperty({
    required: false,
    example: true
  })
  @IsOptional()
  activeOnly?: boolean;
}