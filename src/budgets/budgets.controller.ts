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
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { BudgetsService } from './budgets.service';
  import { 
    CreateBudgetDto, 
    UpdateBudgetDto, 
    BudgetResponseDto, 
    BudgetProgressDto,
    BudgetFilterDto 
  } from './dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { GetUser } from '../auth/decorators/get-user.decorator';
  import { ResponseHelper } from '../common/helpers/response.helper';
  
  @ApiTags('Budgets')
  @Controller('budgets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')  
  export class BudgetsController {
    constructor(private readonly budgetsService: BudgetsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create new budget' })
    @ApiResponse({ 
      status: 201, 
      description: 'Budget created successfully',
      type: BudgetResponseDto 
    })
    async create(
      @GetUser('id') userId: string,
      @Body() createBudgetDto: CreateBudgetDto
    ) {
      const budget = await this.budgetsService.create(userId, createBudgetDto);
      return ResponseHelper.success(budget, 'Budget created successfully');
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all budgets' })
    @ApiResponse({
      status: 200,
      description: 'Retrieved all budgets',
      type: [BudgetResponseDto]
    })
    async findAll(
      @GetUser('id') userId: string,
      @Query() filterDto: BudgetFilterDto
    ) {
      const budgets = await this.budgetsService.findAll(userId);
      return ResponseHelper.success(budgets, 'Budgets retrieved successfully');
    }
  
    @Get('progress')
    @ApiOperation({ summary: 'Get budget progress' })
    @ApiResponse({
      status: 200,
      description: 'Budget progress retrieved',
      type: [BudgetProgressDto]
    })
    async getBudgetProgress(@GetUser('id') userId: string) {
      const progress = await this.budgetsService.getBudgetProgress(userId);
      return ResponseHelper.success(progress, 'Budget progress retrieved successfully');
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get budget by ID' })
    @ApiResponse({
      status: 200,
      description: 'Budget retrieved successfully',
      type: BudgetResponseDto
    })
    async findOne(
      @GetUser('id') userId: string,
      @Param('id') id: string
    ) {
      const budget = await this.budgetsService.findOne(id, userId);
      return ResponseHelper.success(budget, 'Budget retrieved successfully');
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update budget' })
    @ApiResponse({
      status: 200,
      description: 'Budget updated successfully',
      type: BudgetResponseDto
    })
    async update(
      @GetUser('id') userId: string,
      @Param('id') id: string,
      @Body() updateBudgetDto: UpdateBudgetDto
    ) {
      const budget = await this.budgetsService.update(id, userId, updateBudgetDto);
      return ResponseHelper.success(budget, 'Budget updated successfully');
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete budget' })
    @ApiResponse({
      status: 200,
      description: 'Budget deleted successfully'
    })
    async remove(
      @GetUser('id') userId: string,
      @Param('id') id: string
    ) {
      await this.budgetsService.remove(id, userId);
      return ResponseHelper.success(null, 'Budget deleted successfully');
    }
  }