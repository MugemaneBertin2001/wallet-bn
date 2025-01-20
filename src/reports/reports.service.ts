import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Report, ReportType, ReportPeriod } from './entities/report.entity';
import { GenerateReportDto } from './dto/generate-report.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { CategoriesService } from '../categories/categories.service';
import { BudgetsService } from '../budgets/budgets.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private budgetsService: BudgetsService
  ) {}

  async generateReport(userId: string, reportDto: GenerateReportDto): Promise<Report> {
    const reportData = await this.generateReportData(userId, reportDto);

    const report = this.reportRepository.create({
      userId,
      type: reportDto.type,
      period: reportDto.period,
      startDate: reportDto.startDate,
      endDate: reportDto.endDate,
      filters: reportDto.filters,
      data: reportData
    });

    return this.reportRepository.save(report);
  }

  private async generateReportData(userId: string, reportDto: GenerateReportDto) {
    switch (reportDto.type) {
      case ReportType.TRANSACTION:
        return this.generateTransactionReport(userId, reportDto);
      case ReportType.CATEGORY:
        return this.generateCategoryReport(userId, reportDto);
      case ReportType.BUDGET:
        return this.generateBudgetReport(userId, reportDto);
      case ReportType.SUMMARY:
        return this.generateSummaryReport(userId, reportDto);
    }
  }

  private async generateTransactionReport(userId: string, reportDto: GenerateReportDto) {
    const transactions = await this.transactionsService.findAll(userId, {
      startDate: reportDto.startDate,
      endDate: reportDto.endDate,
      ...reportDto.filters
    });

    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(transaction => {
      if (transaction.type === 'INCOME') {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
      }
    });

    return {
      transactions,
      summary: {
        totalIncome,
        totalExpense,
        netAmount: totalIncome - totalExpense
      }
    };
  }

  private async generateCategoryReport(userId: string, reportDto: GenerateReportDto) {
    // Implement category-wise spending analysis
  }

  private async generateBudgetReport(userId: string, reportDto: GenerateReportDto) {
    // Implement budget vs actual spending analysis
  }

  private async generateSummaryReport(userId: string, reportDto: GenerateReportDto) {
    // Implement overall financial summary
  }

  async getReports(userId: string): Promise<Report[]> {
    return this.reportRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Report> {
    return this.reportRepository.findOne({
      where: { id, userId }
    });
  }
}