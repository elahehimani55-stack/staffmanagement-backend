import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { Meeting } from './meeting.entity';

@Entity('meeting_files')
export class MeetingFile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  meetingId!: string;

  @Column()
  fileUrl!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => Meeting)
  @JoinColumn({ name: 'meetingId' })
  meeting!: Meeting;

  @CreateDateColumn()
  createdAt!: Date;
}