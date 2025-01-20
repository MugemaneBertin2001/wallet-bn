import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from '../interfaces/base.entity';

export class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async findOne(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: { id } as any
    });
    
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }
    return entity;
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as any);
    return await this.repository.save(entity as any);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Entity not found');
    }
  }
}