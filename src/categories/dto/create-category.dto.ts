import { IsNotEmpty, IsEnum, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '../entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: CategoryType })
  @IsEnum(CategoryType)
  type: CategoryType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
