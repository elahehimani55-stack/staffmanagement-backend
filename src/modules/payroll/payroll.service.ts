import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payslip } from './entities/payslip.entity';
import { PayslipItem } from './entities/payslip-item.entity';
import { User } from '../users/entities/user.entity';
import { CreatePayslipDto } from './dto/payroll.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payslip)
    private payslipsRepo: Repository<Payslip>,
    @InjectRepository(PayslipItem)
    private itemsRepo: Repository<PayslipItem>,
  ) {}

  // ثبت فیش حقوقی — فقط مدیران
  async createPayslip(creator: User, dto: CreatePayslipDto) {
    if (creator.level > 2) {
      throw new ForbiddenException('فقط مدیران میتوانند فیش ثبت کنند');
    }

    const payslip = this.payslipsRepo.create({
      userId: dto.userId,
      type: dto.type,
      totalAmount: dto.totalAmount,
      paymentDate: dto.paymentDate,
      description: dto.description,
    });

    await this.payslipsRepo.save(payslip);

    if (dto.items) {
      for (const item of dto.items) {
        await this.itemsRepo.save(
          this.itemsRepo.create({
            payslipId: payslip.id,
            label: item.label,
            amount: item.amount,
            itemType: item.itemType,
          }),
        );
      }
    }

    return payslip;
  }

  // گرفتن فیش‌های خودم
  async getMyPayslips(userId: string) {
    return this.payslipsRepo.find({
      where: { userId },
      order: { paymentDate: 'DESC' },
    });
  }

  // جزئیات یه فیش
  async getPayslipById(user: User, payslipId: string) {
    const payslip = await this.payslipsRepo.findOne({
      where: { id: payslipId },
    });

    if (!payslip) throw new NotFoundException('فیش یافت نشد');

    if (payslip.userId !== user.id && user.level > 2) {
      throw new ForbiddenException('دسترسی ندارید');
    }

    const items = await this.itemsRepo.find({
      where: { payslipId },
    });

    return { ...payslip, items };
  }
}