import {
  Controller, Get, Post,
  Body, Param, UseGuards, Req,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto, AddStepDto } from './dto/activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateActivityDto) {
    return this.activitiesService.create(req.user, dto);
  }

  @Get()
  getMyActivities(@Req() req) {
    return this.activitiesService.getMyActivities(req.user.id);
  }

  @Get(':id')
  getById(@Req() req, @Param('id') id: string) {
    return this.activitiesService.getById(req.user, id);
  }

  @Post('steps')
  addStep(@Req() req, @Body() dto: AddStepDto) {
    return this.activitiesService.addStep(req.user, dto);
  }
}