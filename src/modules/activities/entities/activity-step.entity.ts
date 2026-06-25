import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { ActivityRecord } from './activity-record.entity';

@Entity('activity_steps')
export class ActivityStep {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  activityId!: string;

  @Column({ type: 'text' })
  description!: string;

  @ManyToOne(() => ActivityRecord)
  @JoinColumn({ name: 'activityId' })
  activity!: ActivityRecord;

  @CreateDateColumn()
  createdAt!: Date;
}