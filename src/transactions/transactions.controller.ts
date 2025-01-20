import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards,
    Query 
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
  import { TransactionsService } from './transactions.service';
  import { Transaction } from './entities/transaction.entity';
  import { CreateTransactionDto } from './dto/create-transaction.dto';
  import { UpdateTransactionDto } from './dto/update-transaction.dto';
  import { TransactionFilterDto } from './dto/transaction-filter.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { GetUser } from '../auth/decorators/get-user.decorator';
  import { ResponseHelper } from '../common/helpers/response.helper';
  import { ApiCustomResponse } from '../common/decorators/api-response.decorator';
  
  @ApiTags('Transactions')
  @Controller('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')  
  export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create new transaction' })
    @ApiCustomResponse({
      status: 201,
      description: 'Transaction created successfully',
      type: Transaction,
    })
    async create(
      @GetUser('id') userId: string,
      @Body() createTransactionDto: CreateTransactionDto,
    ) {
      const transaction = await this.transactionsService.create(userId, createTransactionDto);
      return ResponseHelper.success(transaction, 'Transaction created successfully');
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all transactions with filters' })
    @ApiCustomResponse({
      status: 200,
      description: 'Transactions retrieved successfully',
      type: [Transaction],
    })
    async findAll(
      @GetUser('id') userId: string,
      @Query() filters: TransactionFilterDto,
    ) {
      const transactions = await this.transactionsService.findAll(userId, filters);
      return ResponseHelper.success(transactions, 'Transactions retrieved successfully');
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get transaction by ID' })
    @ApiCustomResponse({
      status: 200,
      description: 'Transaction retrieved successfully',
      type: Transaction,
    })
    async findOne(
      @GetUser('id') userId: string,
      @Param('id') id: string,
    ) {
      const transaction = await this.transactionsService.findOne(id, userId);
      return ResponseHelper.success(transaction, 'Transaction retrieved successfully');
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update transaction' })
    @ApiCustomResponse({
      status: 200,
      description: 'Transaction updated successfully',
      type: Transaction,
    })
    async update(
      @GetUser('id') userId: string,
      @Param('id') id: string,
      @Body() updateTransactionDto: UpdateTransactionDto,
    ) {
      const transaction = await this.transactionsService.update(id, userId, updateTransactionDto);
      return ResponseHelper.success(transaction, 'Transaction updated successfully');
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete transaction' })
    @ApiCustomResponse({
      status: 200,
      description: 'Transaction deleted successfully',
    })
    async remove(
      @GetUser('id') userId: string,
      @Param('id') id: string,
    ) {
      await this.transactionsService.remove(id, userId);
      return ResponseHelper.success(null, 'Transaction deleted successfully');
    }
  }