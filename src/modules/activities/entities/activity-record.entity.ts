import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ActivityType {
  MANUAL = 'manual',
  FROM_TICKET = 'from_ticket',
}

@Entity('activity_records')
export class ActivityRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  title!: string;

  @Column({ type: 'enum', enum: ActivityType, default: ActivityType.MANUAL })
  type!: ActivityType;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ nullable: true })
  ticketId!: string;

  @Column({ type: 'date', nullable: true })
  completedAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}