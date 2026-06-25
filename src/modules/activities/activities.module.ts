import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { ActivityRecord } from './entities/activity-record.entity';
import { ActivityStep } from './entities/activity-step.entity';
import { ActivityAttachment } from './entities/activity-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActivityRecord,
      ActivityStep,
      ActivityAttachment,
    ]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}