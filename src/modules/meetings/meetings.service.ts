import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './entities/meeting.entity';
import { MeetingParticipant } from './entities/meeting-participant.entity';
import { MeetingFile } from './entities/meeting-file.entity';
import { User } from '../users/entities/user.entity';
import { CreateMeetingDto, AddMeetingFileDto } from './dto/meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private meetingsRepo: Repository<Meeting>,
    @InjectRepository(MeetingParticipant)
    private participantsRepo: Repository<MeetingParticipant>,
    @InjectRepository(MeetingFile)
    private filesRepo: Repository<MeetingFile>,
  ) {}

  async create(creator: User, dto: CreateMeetingDto) {
    const meeting = this.meetingsRepo.create({
      title: dto.title,
      agenda: dto.agenda,
      startTime: dto.startTime,
      location: dto.location,
      onlineLink: dto.onlineLink,
      createdBy: creator.id,
    });

    await this.meetingsRepo.save(meeting);

    // اضافه کردن سازنده به عنوان شرکت‌کننده
    await this.participantsRepo.save(
      this.participantsRepo.create({
        meetingId: meeting.id,
        userId: creator.id,
      }),
    );

    // اضافه کردن بقیه شرکت‌کنندگان
    if (dto.participantIds) {
      for (const userId of dto.participantIds) {
        await this.participantsRepo.save(
          this.participantsRepo.create({
            meetingId: meeting.id,
            userId,
          }),
        );
      }
    }

    return meeting;
  }

  async getMyMeetings(userId: string) {
    const participants = await this.participantsRepo.find({
      where: { userId },
      relations: { meeting: true },
    });

    return participants.map((p) => p.meeting);
  }

  async getMeetingById(user: User, meetingId: string) {
    const meeting = await this.meetingsRepo.findOne({
      where: { id: meetingId },
    });

    if (!meeting) throw new NotFoundException('جلسه یافت نشد');

    const isParticipant = await this.participantsRepo.findOne({
      where: { meetingId, userId: user.id },
    });

    if (!isParticipant) throw new ForbiddenException('دسترسی ندارید');

    const files = await this.filesRepo.find({
      where: { meetingId },
    });

    // شرکت‌کنندگان فقط برای سازنده نمایش داده میشه
    let participants: MeetingParticipant[] | null = null;
    if (meeting.createdBy === user.id) {
      participants = await this.participantsRepo.find({
        where: { meetingId },
      });
    }

    return { ...meeting, files, participants };
  }

  async addFile(user: User, dto: AddMeetingFileDto) {
    const meeting = await this.meetingsRepo.findOne({
      where: { id: dto.meetingId },
    });

    if (!meeting) throw new NotFoundException('جلسه یافت نشد');

    if (meeting.createdBy !== user.id) {
      throw new ForbiddenException('فقط سازنده جلسه میتواند فایل اضافه کند');
    }

    const file = this.filesRepo.create({
      meetingId: dto.meetingId,
      fileUrl: dto.fileUrl,
      description: dto.description,
    });

    return this.filesRepo.save(file);
  }
}