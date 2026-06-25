import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserLevel {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  LEVEL_4 = 4,
  LEVEL_5 = 5,
}

export enum AccountStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  DISABLED = 'disabled',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  nationalCode!: string;

  @Column({ unique: true })
  personnelCode!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ type: 'int' })
  level!: UserLevel;

  @Column({ nullable: true })
  role!: string;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  status!: AccountStatus;

  @Column({ default: true })
  mustChangePassword!: boolean;

  @Column({ nullable: true })
  createdBy!: string;

  @Column({ nullable: true })
  refreshToken!: string;

  @Column({ nullable: true })
  provinceId!: string;

  @Column({ nullable: true })
  centerId!: string;

  @Column({ nullable: true })
  department!: string;

  @Column({ nullable: true })
  supervisorId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
