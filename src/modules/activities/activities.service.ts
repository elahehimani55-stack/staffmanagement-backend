import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityRecord, ActivityType } from './entities/activity-record.entity';
import { ActivityStep } from './entities/activity-step.entity';
import { ActivityAttachment } from './entities/activity-attachment.entity';
import { User } from '../users/entities/user.entity';
import { CreateActivityDto, AddStepDto } from './dto/activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ActivityRecord)
    private recordsRepo: Repository<ActivityRecord>,
    @InjectRepository(ActivityStep)
    private stepsRepo: Repository<ActivityStep>,
    @InjectRepository(ActivityAttachment)
    private attachmentsRepo: Repository<ActivityAttachment>,
  ) {}

  async create(user: User, dto: CreateActivityDto) {
    const record = this.recordsRepo.create({
      userId: user.id,
      title: dto.title,
      description: dto.description,
      completedAt: dto.completedAt,
      type: ActivityType.MANUAL,
    });

    await this.recordsRepo.save(record);

    // ذخیره مراحل
    if (dto.steps) {
      for (const step of dto.steps) {
        await this.stepsRepo.save(
          this.stepsRepo.create({
            activityId: record.id,
            description: step,
          }),
        );
      }
    }

    // ذخیره پیوست‌ها
    if (dto.attachments) {
      for (const fileUrl of dto.attachments) {
        await this.attachmentsRepo.save(
          this.attachmentsRepo.create({
            activityId: record.id,
            fileUrl,
          }),
        );
      }
    }

    return record;
  }

  // این متد از ماژول تیکت صدا زده میشه
  async createFromTicket(
    userId: string,
    ticketId: string,
    title: string,
    description: string,
  ) {
    const record = this.recordsRepo.create({
      userId,
      title,
      description,
      ticketId,
      type: ActivityType.FROM_TICKET,
      completedAt: new Date(),
    });
    return this.recordsRepo.save(record);
  }

  async getMyActivities(userId: string) {
    const records = await this.recordsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const result: object[] = [];
    for (const record of records) {
      const steps = await this.stepsRepo.find({
        where: { activityId: record.id },
      });
      const attachments = await this.attachmentsRepo.find({
        where: { activityId: record.id },
      });
      result.push({ ...record, steps, attachments });
    }

    return result;
  }

  async getById(user: User, activityId: string) {
    const record = await this.recordsRepo.findOne({
      where: { id: activityId },
    });

    if (!record) throw new NotFoundException('سابقه یافت نشد');

    if (record.userId !== user.id) {
      throw new ForbiddenException('دسترسی ندارید');
    }

    const steps = await this.stepsRepo.find({
      where: { activityId },
    });

    const attachments = await this.attachmentsRepo.find({
      where: { activityId },
    });

    return { ...record, steps, attachments };
  }

  async addStep(user: User, dto: AddStepDto) {
    const record = await this.recordsRepo.findOne({
      where: { id: dto.activityId },
    });

    if (!record) throw new NotFoundException('سابقه یافت نشد');
    if (record.userId !== user.id) throw new ForbiddenException('دسترسی ندارید');

    return this.stepsRepo.save(
      this.stepsRepo.create({
        activityId: dto.activityId,
        description: dto.description,
      }),
    );
  }
}