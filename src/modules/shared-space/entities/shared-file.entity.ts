import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SharedFolder } from './shared-folder.entity';

@Entity('shared_files')
export class SharedFile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  folderId!: string;

  @Column()
  fileUrl!: string;

  @Column({ nullable: true })
  fileSize!: number;

  @Column({ nullable: true })
  mimeType!: string;

  @Column()
  uploadedBy!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => SharedFolder)
  @JoinColumn({ name: 'folderId' })
  folder!: SharedFolder;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedBy' })
  uploader!: User;

  @CreateDateColumn()
  createdAt!: Date;
}