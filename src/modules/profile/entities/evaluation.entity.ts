import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  evaluatorId!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  maxScore!: number;

  @Column({ nullable: true, type: 'text' })
  notes!: string;

  @Column({ type: 'date' })
  evaluationDate!: Date;

  @Column({ default: false })
  hasObjection!: boolean;

  @Column({ nullable: true, type: 'text' })
  objectionText!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'evaluatorId' })
  evaluator!: User;

  @CreateDateColumn()
  createdAt!: Date;
}