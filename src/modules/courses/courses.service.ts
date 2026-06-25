import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CourseEnrollment, EnrollmentStatus } from './entities/course-enrollment.entity';
import { CourseReport } from './entities/course-report.entity';
import { User } from '../users/entities/user.entity';
import { CreateCourseDto, AddCourseReportDto, UpdateEnrollmentDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepo: Repository<Course>,
    @InjectRepository(CourseEnrollment)
    private enrollmentsRepo: Repository<CourseEnrollment>,
    @InjectRepository(CourseReport)
    private reportsRepo: Repository<CourseReport>,
  ) {}

  async create(creator: User, dto: CreateCourseDto) {
    const course = this.coursesRepo.create({
      ...dto,
      createdBy: creator.id,
    });
    return this.coursesRepo.save(course);
  }

  async getAllCourses() {
    return this.coursesRepo.find({
      order: { startTime: 'ASC' },
    });
  }

  async getMyCourses(userId: string) {
    const enrollments = await this.enrollmentsRepo.find({
      where: { userId },
      relations: { course: true },
    });
    return enrollments.map((e) => ({
      ...e.course,
      enrollmentStatus: e.status,
    }));
  }

  async enroll(user: User, courseId: string) {
    const course = await this.coursesRepo.findOne({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('دوره یافت نشد');

    const existing = await this.enrollmentsRepo.findOne({
      where: { courseId, userId: user.id },
    });
    if (existing) return { message: 'قبلاً ثبت‌نام شده' };

    const enrollment = this.enrollmentsRepo.create({
      courseId,
      userId: user.id,
      status: EnrollmentStatus.ENROLLED,
    });

    return this.enrollmentsRepo.save(enrollment);
  }

  async addReport(user: User, dto: AddCourseReportDto) {
    const enrollment = await this.enrollmentsRepo.findOne({
      where: { courseId: dto.courseId, userId: user.id },
    });
    if (!enrollment) throw new ForbiddenException('ابتدا ثبت‌نام کنید');

    const report = this.reportsRepo.create({
      courseId: dto.courseId,
      userId: user.id,
      summary: dto.summary,
      certificateUrl: dto.certificateUrl,
    });

    enrollment.status = EnrollmentStatus.COMPLETED;
    await this.enrollmentsRepo.save(enrollment);

    return this.reportsRepo.save(report);
  }

  async getCourseById(courseId: string) {
    const course = await this.coursesRepo.findOne({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('دوره یافت نشد');
    return course;
  }
}