import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from 'typeorm';
import { Meeting } from './meeting.entity';
import { User } from '../../users/entities/user.entity';

@Entity('meeting_participants')
export class MeetingParticipant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  meetingId!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => Meeting)
  @JoinColumn({ name: 'meetingId' })
  meeting!: Meeting;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;
}