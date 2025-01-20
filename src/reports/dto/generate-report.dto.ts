import { IsEnum, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportType, ReportPeriod } from '../entities/report.entity';

export class GenerateReportDto {
  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ enum: ReportPeriod })
  @IsEnum(ReportPeriod)
  period: ReportPeriod;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  filters?: {
    categoryIds?: string[];
    accountIds?: string[];
    transactionTypes?: string[];
  };
}