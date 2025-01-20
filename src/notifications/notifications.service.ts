import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmailService } from "./services/email.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Notification, NotificationType } from "./entities/notification.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private emailService: EmailService,
    private userService: UsersService
  ) {}

  async create(userId: string, createNotificationDto: CreateNotificationDto): Promise<Notification> {
    // Create notification
    const notification = this.notificationRepository.create({
      userId,
      ...createNotificationDto
    });
    await this.notificationRepository.save(notification);

    // Send email if user has email notifications enabled
    const user = await this.userService.findOne(userId);
   
      await this.emailService.sendNotificationEmail(
        user.email,
        notification.title,
        notification.message
      );
  

    return notification;
  }

  async findAll(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId }
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async getUnread(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId, isRead: false },
      order: { createdAt: 'DESC' }
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false }
    });
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    const result = await this.notificationRepository.update(
      { id, userId },
      { isRead: true }
    );

    if (result.affected === 0) {
      throw new NotFoundException('Notification not found');
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true }
    );
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.notificationRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException('Notification not found');
    }
  }

  async sendBudgetExceededNotification(
    userId: string,
    categoryName: string,
    budgetAmount: number,
    spentAmount: number
  ): Promise<void> {
    const user = await this.userService.findOne(userId);

    // Create in-app notification
    await this.create(userId, {
      type: NotificationType.BUDGET_EXCEEDED,
      title: `Budget Exceeded: ${categoryName}`,
      message: `Your budget for ${categoryName} has been exceeded.`,
      data: {
        categoryName,
        budgetAmount,
        spentAmount,
        exceededBy: spentAmount - budgetAmount
      }
    });

 
      await this.emailService.sendBudgetAlert(
        user.email,
        categoryName,
        budgetAmount,
        spentAmount
      );
    
  }

  async sendTransactionNotification(
    userId: string,
    transactionType: string,
    amount: number,
    accountName: string
  ): Promise<void> {
    const user = await this.userService.findOne(userId);

    await this.create(userId, {
      type: NotificationType.TRANSACTION_ALERT,
      title: `New ${transactionType}: ${accountName}`,
      message: `A ${transactionType.toLowerCase()} of $${amount} has been recorded in ${accountName}.`,
      data: {
        transactionType,
        amount,
        accountName
      }
    });

      await this.emailService.sendNotificationEmail(
        user.email,
        `New ${transactionType} Recorded`,
        `A ${transactionType.toLowerCase()} of $${amount} has been recorded in ${accountName}.`
      );
  }

  async sendSystemNotification(
    userId: string,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    const user = await this.userService.findOne(userId);

    await this.create(userId, {
      type: NotificationType.SYSTEM_ALERT,
      title,
      message,
      data
    });

      await this.emailService.sendNotificationEmail(
        user.email,
        title,
        message
      );
  }
}