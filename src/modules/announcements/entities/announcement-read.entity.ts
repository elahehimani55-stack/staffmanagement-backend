import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { Announcement } from './announcement.entity';
import { User } from '../../users/entities/user.entity';

@Entity('announcement_reads')
export class AnnouncementRead {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  announcementId!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => Announcement)
  @JoinColumn({ name: 'announcementId' })
  announcement!: Announcement;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  readAt!: Date;
}