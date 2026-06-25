import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';
import { UserApproval } from './modules/users/entities/user-approval.entity';
import { Conversation } from './modules/chat/entities/conversation.entity';
import { Message } from './modules/chat/entities/message.entity';
import { ConversationParticipant } from './modules/chat/entities/conversation-participant.entity';
import { ConversationRequest } from './modules/chat/entities/conversation-request.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChatModule } from './modules/chat/chat.module';
import { Announcement } from './modules/announcements/entities/announcement.entity';
import { AnnouncementTarget } from './modules/announcements/entities/announcement-target.entity';
import { AnnouncementRead } from './modules/announcements/entities/announcement-read.entity';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { Ticket } from './modules/tickets/entities/ticket.entity';
import { TicketStep } from './modules/tickets/entities/ticket-step.entity';
import { TicketAttachment } from './modules/tickets/entities/ticket-attachment.entity';
import { TicketsModule } from './modules/tickets/tickets.module';
import { StorageModule } from './modules/storage/storage.module';
import { AttendanceRecord } from './modules/attendance/entities/attendance-record.entity';
import { AttendanceDailySummary } from './modules/attendance/entities/attendance-daily-summary.entity';
import { LeaveRequest } from './modules/attendance/entities/leave-request.entity';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { Meeting } from './modules/meetings/entities/meeting.entity';
import { MeetingParticipant } from './modules/meetings/entities/meeting-participant.entity';
import { MeetingFile } from './modules/meetings/entities/meeting-file.entity';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { Course } from './modules/courses/entities/course.entity';
import { CourseEnrollment } from './modules/courses/entities/course-enrollment.entity';
import { CourseReport } from './modules/courses/entities/course-report.entity';
import { CoursesModule } from './modules/courses/courses.module';
import { ActivityRecord } from './modules/activities/entities/activity-record.entity';
import { ActivityStep } from './modules/activities/entities/activity-step.entity';
import { ActivityAttachment } from './modules/activities/entities/activity-attachment.entity';
import { ActivitiesModule } from './modules/activities/activities.module';
import { Payslip } from './modules/payroll/entities/payslip.entity';
import { PayslipItem } from './modules/payroll/entities/payslip-item.entity';
import { PayrollModule } from './modules/payroll/payroll.module';
import { SupervisionModule } from './modules/supervision/supervision.module';
import { UserRelation } from './modules/supervision/entities/user-relation.entity';
import { Address } from './modules/profile/entities/address.entity';
import { Contract } from './modules/profile/entities/contract.entity';
import { JobHistory } from './modules/profile/entities/job-history.entity';
import { Evaluation } from './modules/profile/entities/evaluation.entity';
import { ProfileModule } from './modules/profile/profile.module';
import { SharedFolder } from './modules/shared-space/entities/shared-folder.entity';
import { SharedFile } from './modules/shared-space/entities/shared-file.entity';
import { SharedSpaceModule } from './modules/shared-space/shared-space.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') ?? '5432'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [
          User,
          UserApproval,
          Conversation,
          Message,
          ConversationParticipant,
          ConversationRequest,
          Announcement,
          AnnouncementTarget,
          AnnouncementRead,
          Ticket,
          TicketStep,
          TicketAttachment,
          AttendanceRecord,
          AttendanceDailySummary,
          LeaveRequest,
          Meeting,
          MeetingParticipant,
          MeetingFile,
          Course,
          CourseEnrollment,
          CourseReport,
          ActivityRecord,
          ActivityStep,
          ActivityAttachment,
          Payslip,
          PayslipItem,
          UserRelation,
          Address,
          Contract,
          JobHistory,
          Evaluation,
          SharedFolder,
          SharedFile,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ChatModule,
    AnnouncementsModule,
    TicketsModule,
    StorageModule,
    AttendanceModule,
    MeetingsModule,
    CoursesModule,
    ActivitiesModule,
    PayrollModule,
    SupervisionModule,
    ProfileModule,
    SharedSpaceModule,
  ],
})
export class AppModule {}
