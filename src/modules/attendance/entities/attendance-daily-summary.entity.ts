import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum DayStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  LEAVE = 'leave',
  MISSION = 'mission',
  OVERTIME = 'overtime',
}

@Entity('attendance_daily_summary')
export class AttendanceDailySummary {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ nullable: true, type: 'timestamp' })
  firstEntry!: Date;

  @Column({ nullable: true, type: 'timestamp' })
  lastExit!: Date;

  @Column({ nullable: true })
  totalMinutes!: number;

  @Column({
    type: 'enum',
    enum: DayStatus,
    default: DayStatus.PRESENT,
  })
  status!: DayStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;
}