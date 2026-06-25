import { IsEnum, IsDateString, IsString, IsOptional } from 'class-validator';
import { LeaveType } from '../entities/leave-request.entity';

export class RecordAttendanceDto {
  @IsString()
  personnelCode!: string;

  @IsEnum(['enter', 'exit'])
  type!: string;
}

export class CreateLeaveRequestDto {
  @IsEnum(LeaveType)
  type!: LeaveType;

  @IsDateString()
  startDate!: Date;

  @IsDateString()
  endDate!: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;
}

export class ReviewLeaveDto {
  @IsString()
  requestId!: string;

  @IsEnum(['approved', 'rejected'])
  action!: string;

  @IsString()
  @IsOptional()
  rejectReason?: string;
}