import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { EnrollmentStatus } from '../entities/course-enrollment.entity';

export class CreateCourseDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  instructor?: string;

  @IsDateString()
  startTime!: Date;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  onlineLink?: string;
}

export class AddCourseReportDto {
  @IsString()
  courseId!: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  certificateUrl?: string;
}

export class UpdateEnrollmentDto {
  @IsString()
  courseId!: string;

  @IsEnum(EnrollmentStatus)
  status!: EnrollmentStatus;
}