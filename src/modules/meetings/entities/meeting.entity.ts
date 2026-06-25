import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum MeetingStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  DONE = 'done',
}

@Entity('meetings')
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  agenda!: string;

  @Column({ type: 'timestamp' })
  startTime!: Date;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  onlineLink!: string;

  @Column({
    type: 'enum',
    enum: MeetingStatus,
    default: MeetingStatus.UPCOMING,
  })
  status!: MeetingStatus;

  @Column()
  createdBy!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator!: User;

  @CreateDateColumn()
  createdAt!: Date;
}