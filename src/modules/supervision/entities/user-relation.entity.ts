import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum RelationType {
  DIRECT = 'direct',
  INDIRECT = 'indirect',
}

@Entity('user_relations')
export class UserRelation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  managerId!: string;

  @Column()
  subordinateId!: string;

  @Column({
    type: 'enum',
    enum: RelationType,
    default: RelationType.DIRECT,
  })
  relationType!: RelationType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'managerId' })
  manager!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'subordinateId' })
  subordinate!: User;

  @CreateDateColumn()
  createdAt!: Date;
}