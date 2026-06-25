import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum CourseStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  DONE = 'done',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ nullable: true })
  instructor!: string;

  @Column({ type: 'timestamp' })
  startTime!: Date;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  onlineLink!: string;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.UPCOMING,
  })
  status!: CourseStatus;

  @Column()
  createdBy!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator!: User;

  @CreateDateColumn()
  createdAt!: Date;
}