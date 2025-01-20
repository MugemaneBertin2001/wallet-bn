import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ResponseHelper } from '../common/helpers/response.helper';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')  
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate new report' })
  async generateReport(
    @GetUser('id') userId: string,
    @Body() generateReportDto: GenerateReportDto
  ) {
    const report = await this.reportsService.generateReport(userId, generateReportDto);
    return ResponseHelper.success(report, 'Report generated successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  async getReports(@GetUser('id') userId: string) {
    const reports = await this.reportsService.getReports(userId);
    return ResponseHelper.success(reports, 'Reports retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by ID' })
  async getReport(
    @GetUser('id') userId: string,
    @Param('id') id: string
  ) {
    const report = await this.reportsService.findOne(id, userId);
    return ResponseHelper.success(report, 'Report retrieved successfully');
  }
}