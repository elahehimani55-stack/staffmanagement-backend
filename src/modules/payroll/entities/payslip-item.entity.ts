import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from 'typeorm';
import { Payslip } from './payslip.entity';

export enum ItemType {
  INCREASE = 'increase',
  DECREASE = 'decrease',
}

@Entity('payslip_items')
export class PayslipItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  payslipId!: string;

  @Column()
  label!: string;

  @Column({ type: 'decimal', precision: 12, scale: 0 })
  amount!: number;

  @Column({ type: 'enum', enum: ItemType })
  itemType!: ItemType;

  @ManyToOne(() => Payslip)
  @JoinColumn({ name: 'payslipId' })
  payslip!: Payslip;
}