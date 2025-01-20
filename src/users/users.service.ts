import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { BaseService } from '../common/base/base.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }
    const user = this.repository.create(data as any);
    return this.repository.save(user as any);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashPassword(newPassword);
    await this.repository.update(userId, { password: hashedPassword } as any);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}