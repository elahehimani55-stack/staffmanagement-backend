import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ApprovalAction {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('user_approvals')
export class UserApproval {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  approvedBy!: string;

  @Column({
    type: 'enum',
    enum: ApprovalAction,
  })
  action!: ApprovalAction;

  @Column({ nullable: true })
  reason!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approvedBy' })
  approver!: User;

  @CreateDateColumn()
  createdAt!: Date;
}