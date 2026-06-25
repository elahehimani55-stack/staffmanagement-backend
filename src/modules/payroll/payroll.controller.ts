import {
  Controller, Get, Post,
  Body, Param, UseGuards, Req,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayslipDto } from './dto/payroll.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Post()
  create(@Req() req, @Body() dto: CreatePayslipDto) {
    return this.payrollService.createPayslip(req.user, dto);
  }

  @Get()
  getMyPayslips(@Req() req) {
    return this.payrollService.getMyPayslips(req.user.id);
  }

  @Get(':id')
  getById(@Req() req, @Param('id') id: string) {
    return this.payrollService.getPayslipById(req.user, id);
  }
}