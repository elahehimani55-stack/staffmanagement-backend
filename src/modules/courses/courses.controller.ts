import {
  Controller, Get, Post,
  Body, Param, UseGuards, Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, AddCourseReportDto } from './dto/course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateCourseDto) {
    return this.coursesService.create(req.user, dto);
  }

  @Get()
  getAll() {
    return this.coursesService.getAllCourses();
  }

  @Get('my')
  getMyCourses(@Req() req) {
    return this.coursesService.getMyCourses(req.user.id);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.coursesService.getCourseById(id);
  }

  @Post(':id/enroll')
  enroll(@Req() req, @Param('id') id: string) {
    return this.coursesService.enroll(req.user, id);
  }

  @Post('report')
  addReport(@Req() req, @Body() dto: AddCourseReportDto) {
    return this.coursesService.addReport(req.user, dto);
  }
}