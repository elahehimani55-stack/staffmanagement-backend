import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { Payslip } from './entities/payslip.entity';
import { PayslipItem } from './entities/payslip-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payslip, PayslipItem])],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}