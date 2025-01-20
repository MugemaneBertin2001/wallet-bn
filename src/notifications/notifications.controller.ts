import { Controller, Get, Post, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ResponseHelper } from '../common/helpers/response.helper';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')  
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  async findAll(@GetUser('id') userId: string) {
    const notifications = await this.notificationsService.findAll(userId);
    return ResponseHelper.success(notifications, 'Notifications retrieved successfully');
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread notifications' })
  async getUnread(@GetUser('id') userId: string) {
    const notifications = await this.notificationsService.getUnread(userId);
    return ResponseHelper.success(notifications, 'Unread notifications retrieved successfully');
  }

  @Get('count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  async getUnreadCount(@GetUser('id') userId: string) {
    const count = await this.notificationsService.getUnreadCount(userId);
    return ResponseHelper.success({ count }, 'Unread count retrieved successfully');
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(
    @GetUser('id') userId: string,
    @Param('id') id: string
  ) {
    await this.notificationsService.markAsRead(id, userId);
    return ResponseHelper.success(null, 'Notification marked as read');
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@GetUser('id') userId: string) {
    await this.notificationsService.markAllAsRead(userId);
    return ResponseHelper.success(null, 'All notifications marked as read');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  async remove(
    @GetUser('id') userId: string,
    @Param('id') id: string
  ) {
    await this.notificationsService.remove(id, userId);
    return ResponseHelper.success(null, 'Notification deleted successfully');
  }
}