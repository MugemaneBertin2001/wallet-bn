import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ResponseHelper } from '../common/helpers/response.helper';
import { ApiCustomResponse } from '../common/decorators/api-response.decorator';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')  
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new category' })
  @ApiCustomResponse({
    status: 201,
    description: 'Category created successfully',
    type: Category,
  })
  async create(
    @GetUser('id') userId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const category = await this.categoriesService.createCategory(userId, createCategoryDto);
    return ResponseHelper.success(category, 'Category created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all user categories' })
  @ApiCustomResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [Category],
  })
  async findAll(
    @GetUser('id') userId: string,
    @Query('parentId') parentId?: string,
  ) {
    const categories = await this.categoriesService.findUserCategories(userId, parentId);
    return ResponseHelper.success(categories, 'Categories retrieved successfully');
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get category hierarchy' })
  @ApiCustomResponse({
    status: 200,
    description: 'Category hierarchy retrieved successfully',
    type: [Category],
  })
  async getHierarchy(@GetUser('id') userId: string) {
    const hierarchy = await this.categoriesService.getCategoryHierarchy(userId);
    return ResponseHelper.success(hierarchy, 'Category hierarchy retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiCustomResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: Category,
  })
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    return ResponseHelper.success(category, 'Category retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiCustomResponse({
    status: 200,
    description: 'Category updated successfully',
    type: Category,
  })
  async update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.updateCategory(id, userId, updateCategoryDto);
    return ResponseHelper.success(category, 'Category updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiCustomResponse({
    status: 200,
    description: 'Category deleted successfully',
  })
  async remove(@Param('id') id: string, @GetUser('id') userId: string) {
    await this.categoriesService.deleteCategory(id, userId);
    return ResponseHelper.success(null, 'Category deleted successfully');
  }
}