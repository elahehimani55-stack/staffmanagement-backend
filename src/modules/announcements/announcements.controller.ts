import {
  Controller, Get, Post, Delete,
  Body, Param, UseGuards, Req,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(req.user, dto);
  }

  @Get()
  getMyAnnouncements(@Req() req) {
    return this.announcementsService.getMyAnnouncements(req.user);
  }

  @Get('unread-count')
  getUnreadCount(@Req() req) {
    return this.announcementsService.getUnreadCount(req.user);
  }

  @Post(':id/read')
  markAsRead(@Req() req, @Param('id') id: string) {
    return this.announcementsService.markAsRead(req.user.id, id);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.announcementsService.delete(req.user, id);
  }
}