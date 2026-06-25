import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { ActivityRecord } from './activity-record.entity';

@Entity('activity_attachments')
export class ActivityAttachment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  activityId!: string;

  @Column()
  fileUrl!: string;

  @ManyToOne(() => ActivityRecord)
  @JoinColumn({ name: 'activityId' })
  activity!: ActivityRecord;

  @CreateDateColumn()
  createdAt!: Date;
}