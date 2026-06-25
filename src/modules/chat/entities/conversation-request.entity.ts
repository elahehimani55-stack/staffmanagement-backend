import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('conversation_requests')
export class ConversationRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fromUserId!: string;

  @Column()
  toUserId!: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status!: RequestStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'fromUserId' })
  fromUser!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'toUserId' })
  toUser!: User;

  @CreateDateColumn()
  createdAt!: Date;
}