import { ApiProperty } from '@nestjs/swagger';

export class BudgetProgressDto {
  @ApiProperty({
    example: 'Groceries'
  })
  categoryName: string;

  @ApiProperty({
    example: 500.00
  })
  budgeted: number;

  @ApiProperty({
    example: 150.00
  })
  spent: number;

  @ApiProperty({
    example: 350.00
  })
  remaining: number;

  @ApiProperty({
    example: 30
  })
  progress: number;
}