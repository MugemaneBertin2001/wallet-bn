import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { ResponseHelper } from '../common/helpers/response.helper';
import { ApiCustomResponse } from '../common/decorators/api-response.decorator';
import { CreateAccountDto } from './entities/dto/create-account.dto';
import { UpdateAccountDto } from './entities/dto/update-account.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')  
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new account' })
  @ApiCustomResponse({
    status: 201,
    description: 'Account created successfully',
    type: Account,
  })
  async create(
    @GetUser('id') userId: string,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    const account = await this.accountsService.createAccount(userId, createAccountDto);
    return ResponseHelper.success(account, 'Account created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all user accounts' })
  @ApiCustomResponse({
    status: 200,
    description: 'Accounts retrieved successfully',
    type: [Account],
  })
  async findAll(@GetUser('id') userId: string) {
    const accounts = await this.accountsService.findUserAccounts(userId);
    return ResponseHelper.success(accounts, 'Accounts retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiCustomResponse({
    status: 200,
    description: 'Account retrieved successfully',
    type: Account,
  })
  async findOne(@Param('id') id: string) {
    const account = await this.accountsService.findOne(id);
    return ResponseHelper.success(account, 'Account retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiCustomResponse({
    status: 200,
    description: 'Account updated successfully',
    type: Account,
  })
  async update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    const account = await this.accountsService.updateAccount(id, userId, updateAccountDto);
    return ResponseHelper.success(account, 'Account updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiCustomResponse({
    status: 200,
    description: 'Account deleted successfully',
  })
  async remove(@Param('id') id: string, @GetUser('id') userId: string) {
    await this.accountsService.deleteAccount(id, userId);
    return ResponseHelper.success(null, 'Account deleted successfully');
  }
}