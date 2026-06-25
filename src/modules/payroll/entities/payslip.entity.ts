import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PayslipType {
  SALARY = 'salary',
  BONUS = 'bonus',
  OVERTIME = 'overtime',
  MISSION = 'mission',
  DEDUCTION = 'deduction',
}

@Entity('payslips')
export class Payslip {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column({ type: 'enum', enum: PayslipType, default: PayslipType.SALARY })
  type!: PayslipType;

  @Column({ type: 'decimal', precision: 12, scale: 0 })
  totalAmount!: number;

  @Column({ type: 'date' })
  paymentDate!: Date;

  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}