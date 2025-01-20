import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

interface SendEmailDto {
  to: string;
  subject: string;
  text: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly emailApiUrl = 'http://167.99.222.32:8080/api/mail/send';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async sendEmail(emailData: SendEmailDto): Promise<boolean> {
    try {
      const response = await this.httpService.post(
        this.emailApiUrl,
        emailData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      ).toPromise();

      this.logger.log(`Email sent to ${emailData.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return false;
    }
  }

  async sendNotificationEmail(to: string, title: string, message: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: title,
      text: message
    });
  }

  async sendBudgetAlert(to: string, categoryName: string, budgetAmount: number, spentAmount: number): Promise<boolean> {
    const subject = `Budget Alert: ${categoryName}`;
    const text = `
      Your budget for ${categoryName} has been exceeded.
      Budget: $${budgetAmount}
      Spent: $${spentAmount}
      Exceeded by: $${spentAmount - budgetAmount}
    `;

    return this.sendEmail({ to, subject, text });
  }
}