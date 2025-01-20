import { IsEnum, IsNumber, IsString, IsUUID, IsDateString, IsOptional, IsPhoneNumber, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';
import { TransactionSource } from '../enums/transaction-source.enum';

export class CreateTransactionDto {
    @ApiProperty({ 
        enum: TransactionSource,
        description: 'Source of the transaction',
        example: TransactionSource.MOBILE_MONEY
    })
    @IsEnum(TransactionSource)
    source: TransactionSource;
  
    @ApiProperty({
        description: 'ID of the account',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    accountId: string;
  
    @ApiProperty({
        description: 'Transaction amount',
        example: 1000.50
    })
    @IsNumber()
    amount: number;
  
    @ApiProperty({
        enum: TransactionType,
        description: 'Type of transaction',
        example: TransactionType.EXPENSE
    })
    @IsEnum(TransactionType)
    type: TransactionType;
  
    @ApiProperty({
        description: 'Transaction description',
        example: 'Grocery shopping',
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string;
  
    @ApiProperty({
        description: 'Phone number for mobile money transactions',
        example: '+254700000000',
        required: false
    })
    @ValidateIf(o => o.source === TransactionSource.MOBILE_MONEY)
    @IsPhoneNumber()
    phoneNumber?: string;
  
    @ApiProperty({
        description: 'Bank account number for bank transactions',
        example: '1234567890',
        required: false
    })
    @ValidateIf(o => o.source === TransactionSource.BANK)
    @IsString()
    bankAccountNumber?: string;
  
    @ApiProperty({
        description: 'Date of the transaction',
        example: '2025-01-18T12:00:00Z'
    })
    @IsDateString()
    date: Date;
  
    @ApiProperty({
        description: 'External reference number',
        example: 'MPESA123456',
        required: false
    })
    @IsOptional()
    @IsString()
    externalReference?: string;
}