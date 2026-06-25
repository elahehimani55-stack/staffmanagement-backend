import {
  Controller, Get, Post, Body,
  Query, UseGuards, Req,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import {
  RecordAttendanceDto,
  CreateLeaveRequestDto,
  ReviewLeaveDto,
} from './dto/attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AttendanceType } from './entities/attendance-record.entity';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  // ثبت ورود/خروج
  @Post('record')
  record(@Req() req, @Body() dto: RecordAttendanceDto) {
    return this.attendanceService.recordAttendance(
      req.user.id,
      dto.type as AttendanceType,
    );
  }

  // خلاصه ماهانه
  @Get('monthly')
  getMonthlySummary(
    @Req() req,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.attendanceService.getMonthlySummary(
      req.user.id,
      year,
      month,
    );
  }

  // ثبت درخواست مرخصی
  @Post('leave')
  createLeave(@Req() req, @Body() dto: CreateLeaveRequestDto) {
    return this.attendanceService.createLeaveRequest(req.user, dto);
  }

  // لیست مرخصی‌های خودم
  @Get('leave')
  getMyLeaves(@Req() req) {
    return this.attendanceService.getMyLeaveRequests(req.user.id);
  }

  // بررسی درخواست‌ها توسط مافوق
  @Post('leave/review')
  reviewLeave(@Req() req, @Body() dto: ReviewLeaveDto) {
    return this.attendanceService.reviewLeave(req.user, dto);
  }

  // درخواست‌های در انتظار
  @Get('leave/pending')
  getPendingLeaves(@Req() req) {
    return this.attendanceService.getPendingLeaves(req.user.id);
  }
}