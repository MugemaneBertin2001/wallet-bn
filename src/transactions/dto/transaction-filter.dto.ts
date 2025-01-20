import { IsDateString,IsOptional,IsEnum, IsUUID  } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "../entities/transaction.entity";

export class TransactionFilterDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    startDate?: Date;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    endDate?: Date;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    accountId?: string;
  
    @ApiProperty({ required: false })   
    @IsOptional()
    @IsUUID()
    categoryId?: string;
  
    @ApiProperty({ required: false, enum: TransactionType })
    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType;
  }