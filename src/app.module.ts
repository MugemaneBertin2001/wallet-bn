import { Module,Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './configs/database.config';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/src/accounts/accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BudgetsModule } from './budgets/budgets.module';
import { ReportsModule } from './reports/reports.module';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    BudgetsModule,
    ReportsModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  onModuleInit() {
    this.logger.log('Database connection initialized');
  }
}