import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from 'typeorm';
import { Announcement } from './announcement.entity';

@Entity('announcement_targets')
export class AnnouncementTarget {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  announcementId!: string;

  @Column({ nullable: true })
  targetLevel!: number;

  @Column({ nullable: true })
  targetUserId!: string;

  @ManyToOne(() => Announcement)
  @JoinColumn({ name: 'announcementId' })
  announcement!: Announcement;
}