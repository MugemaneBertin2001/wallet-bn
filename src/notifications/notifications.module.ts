import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { EmailService } from './services/email.service';
import { NotificationsController } from './notifications.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    HttpModule,
    UsersModule
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService],
  exports: [NotificationsService, EmailService]
})
export class NotificationsModule {}