import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord, AttendanceType } from './entities/attendance-record.entity';
import { AttendanceDailySummary } from './entities/attendance-daily-summary.entity';
import { LeaveRequest, LeaveStatus } from './entities/leave-request.entity';
import { User } from '../users/entities/user.entity';
import { CreateLeaveRequestDto, ReviewLeaveDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private recordsRepo: Repository<AttendanceRecord>,
    @InjectRepository(AttendanceDailySummary)
    private summaryRepo: Repository<AttendanceDailySummary>,
    @InjectRepository(LeaveRequest)
    private leaveRepo: Repository<LeaveRequest>,
  ) {}

  // ثبت ورود/خروج از دستگاه
  async recordAttendance(userId: string, type: AttendanceType) {
    const record = this.recordsRepo.create({
      userId,
      type,
      recordedAt: new Date(),
    });
    return this.recordsRepo.save(record);
  }

  // گرفتن خلاصه ماهانه
  async getMonthlySummary(userId: string, year: number, month: number) {
    return this.summaryRepo
      .createQueryBuilder('s')
      .where('s.userId = :userId', { userId })
      .andWhere('EXTRACT(YEAR FROM s.date) = :year', { year })
      .andWhere('EXTRACT(MONTH FROM s.date) = :month', { month })
      .orderBy('s.date', 'ASC')
      .getMany();
  }

  // ثبت درخواست مرخصی
  async createLeaveRequest(user: User, dto: CreateLeaveRequestDto) {
    const leave = this.leaveRepo.create({
      userId: user.id,
      type: dto.type,
      startDate: dto.startDate,
      endDate: dto.endDate,
      description: dto.description,
      fileUrl: dto.fileUrl,
    });
    return this.leaveRepo.save(leave);
  }

  // گرفتن درخواست‌های مرخصی کاربر
  async getMyLeaveRequests(userId: string) {
    return this.leaveRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // بررسی درخواست توسط مافوق
  async reviewLeave(supervisor: User, dto: ReviewLeaveDto) {
    const leave = await this.leaveRepo.findOne({
      where: { id: dto.requestId },
    });

    if (!leave) throw new NotFoundException('درخواست یافت نشد');

    if (supervisor.level >= 5) {
      throw new ForbiddenException('شما مجاز به بررسی درخواست نیستید');
    }

    leave.status =
      dto.action === 'approved'
        ? LeaveStatus.APPROVED
        : LeaveStatus.REJECTED;
    leave.reviewedBy = supervisor.id;
    leave.rejectReason = dto.rejectReason ?? '';

    return this.leaveRepo.save(leave);
  }

  // گرفتن درخواست‌های در انتظار برای مافوق
  async getPendingLeaves(supervisorId: string) {
    return this.leaveRepo
      .createQueryBuilder('l')
      .innerJoin('users', 'u', 'u.id = l.userId')
      .where('l.status = :status', { status: LeaveStatus.PENDING })
      .getMany();
  }
}