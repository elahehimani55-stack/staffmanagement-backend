import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementTarget } from './entities/announcement-target.entity';
import { AnnouncementRead } from './entities/announcement-read.entity';
import { User } from '../users/entities/user.entity';
import { CreateAnnouncementDto } from './dto/announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepo: Repository<Announcement>,
    @InjectRepository(AnnouncementTarget)
    private targetsRepo: Repository<AnnouncementTarget>,
    @InjectRepository(AnnouncementRead)
    private readsRepo: Repository<AnnouncementRead>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(creator: User, dto: CreateAnnouncementDto) {
    // کاربر فقط میتونه برای سطح خودش و پایین‌تر اطلاعیه بده
    if (dto.targetLevel && dto.targetLevel < creator.level) {
      throw new ForbiddenException(
        'فقط میتوانید برای سطح خود و پایین‌تر اطلاعیه بفرستید',
      );
    }

    const announcement = this.announcementsRepo.create({
      title: dto.title,
      content: dto.content,
      createdBy: creator.id,
      fileUrl: dto.fileUrl,
    });

    await this.announcementsRepo.save(announcement);

    if (dto.targetLevel) {
      await this.targetsRepo.save(
        this.targetsRepo.create({
          announcementId: announcement.id,
          targetLevel: dto.targetLevel,
        }),
      );
    }
    
    if (dto.targetUserIds) {
      for (const userId of dto.targetUserIds) {
        await this.targetsRepo.save(
          this.targetsRepo.create({
            announcementId: announcement.id,
            targetUserId: userId,
          }),
        );
      }
    }

    return announcement;
  }

  async getMyAnnouncements(user: User) {
    // اطلاعیه‌هایی که:
    // ۱. سطح هدف >= سطح کاربر (یعنی کاربر در محدوده هدف است)
    // ۲. یا ایجادکننده خود کاربر است
    return this.announcementsRepo
      .createQueryBuilder('a')
      .leftJoin(
        'announcement_targets',
        't',
        't.announcementId = a.id',
      )
      .where(
        '(t.targetLevel >= :level OR a.createdBy = :userId)',
        { level: user.level, userId: user.id },
      )
      .orderBy('a.createdAt', 'DESC')
      .distinct(true)
      .getMany();
  }

  async markAsRead(userId: string, announcementId: string) {
    const existing = await this.readsRepo.findOne({
      where: { userId, announcementId },
    });

    if (existing) return { message: 'قبلاً خوانده شده' };

    await this.readsRepo.save(
      this.readsRepo.create({ userId, announcementId }),
    );

    return { message: 'به عنوان خوانده شده ثبت شد' };
  }

  async getUnreadCount(user: User) {
    const total = await this.announcementsRepo
      .createQueryBuilder('a')
      .innerJoin(
        'announcement_targets',
        't',
        't.announcementId = a.id AND (t.targetLevel = :level OR t.targetUserId = :userId)',
        { level: user.level, userId: user.id },
      )
      .getCount();

    const read = await this.readsRepo.count({
      where: { userId: user.id },
    });

    return { unreadCount: total - read };
  }

  async delete(user: User, announcementId: string) {
    const announcement = await this.announcementsRepo.findOne({
      where: { id: announcementId },
    });

    if (!announcement) return { message: 'اطلاعیه یافت نشد' };

    // فقط ایجادکننده یا سطوح بالاتر از ایجادکننده می‌توانند حذف کنند
    const creator = await this.usersRepo.findOne({
      where: { id: announcement.createdBy },
    });

    if (
      announcement.createdBy !== user.id &&
      (!creator || user.level >= creator.level)
    ) {
      throw new ForbiddenException('مجاز به حذف این اطلاعیه نیستید');
    }

    await this.announcementsRepo.remove(announcement);
    return { message: 'اطلاعیه حذف شد' };
  }  
}