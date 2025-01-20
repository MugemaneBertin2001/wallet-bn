// create-account.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';
import { AccountType } from '../account.entity';

export class CreateAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: AccountType })
  @IsEnum(AccountType)
  type: AccountType;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiProperty({ required: false, default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;
}
