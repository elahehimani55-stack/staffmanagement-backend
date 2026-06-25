import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChatModule } from './modules/chat/chat.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { StorageModule } from './modules/storage/storage.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { PayrollModule } from './modules/payroll/payroll.module';
import { SupervisionModule } from './modules/supervision/supervision.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SharedSpaceModule } from './modules/shared-space/shared-space.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
                
        ssl: {
          rejectUnauthorized: false,
        },

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
