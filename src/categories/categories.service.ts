import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BaseService } from '../common/base/base.service';

@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {
    super(categoriesRepository);
  }

  async createCategory(userId: string, createCategoryDto: CreateCategoryDto): Promise<Category> {
    if (createCategoryDto.parentId) {
      const parentExists = await this.findOne(createCategoryDto.parentId);
      if (!parentExists) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      userId,
    });
    return this.categoriesRepository.save(category);
  }

  async findUserCategories(userId: string, parentId?: string): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { 
        userId,
        parentId: parentId || null 
      },
      relations: ['parent'],
      order: { name: 'ASC' },
    });
  }

  async updateCategory(id: string, userId: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (category.userId !== userId) {
      throw new NotFoundException('Category not found');
    }

    if (updateCategoryDto.parentId) {
      const parentExists = await this.findOne(updateCategoryDto.parentId);
      if (!parentExists) {
        throw new NotFoundException('Parent category not found');
      }
    }

    await this.categoriesRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const category = await this.findOne(id);
    if (category.userId !== userId) {
      throw new NotFoundException('Category not found');
    }

    await this.categoriesRepository.delete(id);
  }

  async getCategoryHierarchy(userId: string): Promise<Category[]> {
    const categories = await this.categoriesRepository.find({
      where: { userId },
      relations: ['parent'],
      order: { name: 'ASC' },
    });

    return this.buildHierarchy(categories);
  }

  private buildHierarchy(categories: Category[]): Category[] {
    const categoryMap = new Map();
    const roots: Category[] = [];

    // First, map all categories by their ID
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Then, build the hierarchy
    categories.forEach(category => {
      const mappedCategory = categoryMap.get(category.id);
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          parent.children.push(mappedCategory);
        }
      } else {
        roots.push(mappedCategory);
      }
    });

    return roots;
  }
}