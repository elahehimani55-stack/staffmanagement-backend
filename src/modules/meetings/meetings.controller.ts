import {
  Controller, Get, Post,
  Body, Param, UseGuards, Req,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto, AddMeetingFileDto } from './dto/meeting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(private meetingsService: MeetingsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateMeetingDto) {
    return this.meetingsService.create(req.user, dto);
  }

  @Get()
  getMyMeetings(@Req() req) {
    return this.meetingsService.getMyMeetings(req.user.id);
  }

  @Get(':id')
  getById(@Req() req, @Param('id') id: string) {
    return this.meetingsService.getMeetingById(req.user, id);
  }

  @Post('files')
  addFile(@Req() req, @Body() dto: AddMeetingFileDto) {
    return this.meetingsService.addFile(req.user, dto);
  }
}