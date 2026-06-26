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
import { SupervisionModule } from './modules/supervision/supervision.module';
import { UserRelation } from './modules/supervision/entities/user-relation.entity';
import { Address } from './modules/profile/entities/address.entity';
import { Contract } from './modules/profile/entities/contract.entity';
import { JobHistory } from './modules/profile/entities/job-history.entity';
import { Evaluation } from './modules/profile/entities/evaluation.entity';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get('DATABASE_URL');
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [
              User, UserApproval, Conversation, Message,
              ConversationParticipant, ConversationRequest,
              Announcement, AnnouncementTarget, AnnouncementRead,
              UserRelation, Address, Contract, JobHistory, Evaluation,
            ],
            synchronize: true,
            ssl: { rejectUnauthorized: false },
          };
        }
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: parseInt(config.get('DB_PORT') ?? '5432'),
          username: config.get('DB_USER'),
          password: config.get('DB_PASS'),
          database: config.get('DB_NAME'),
          entities: [
            User, UserApproval, Conversation, Message,
            ConversationParticipant, ConversationRequest,
            Announcement, AnnouncementTarget, AnnouncementRead,
            UserRelation, Address, Contract, JobHistory, Evaluation,
          ],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ChatModule,
    AnnouncementsModule,
    SupervisionModule,
    ProfileModule,
  ],
})
export class AppModule {}