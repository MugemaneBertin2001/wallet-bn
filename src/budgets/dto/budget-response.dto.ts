import { ApiProperty } from '@nestjs/swagger';
import { BudgetPeriod } from '../entities/budget.entity';

export class BudgetResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  categoryId: string;

  @ApiProperty({
    example: 500.00
  })
  amount: number;

  @ApiProperty({
    example: 150.00
  })
  spent: number;

  @ApiProperty({
    enum: BudgetPeriod,
    example: BudgetPeriod.MONTHLY
  })
  period: BudgetPeriod;

  @ApiProperty({
    example: '2025-01-01'
  })
  startDate: Date;

  @ApiProperty({
    example: '2025-12-31'
  })
  endDate?: Date;

  @ApiProperty({
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    example: '2025-01-01T00:00:00Z'
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-01T00:00:00Z'
  })
  updatedAt: Date;
}