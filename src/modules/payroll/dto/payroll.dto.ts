import { IsString, IsEnum, IsNumber, IsDateString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PayslipType } from '../entities/payslip.entity';
import { ItemType } from '../entities/payslip-item.entity';

export class PayslipItemDto {
  @IsString()
  label!: string;

  @IsNumber()
  amount!: number;

  @IsEnum(ItemType)
  itemType!: ItemType;
}

export class CreatePayslipDto {
  @IsString()
  userId!: string;

  @IsEnum(PayslipType)
  type!: PayslipType;

  @IsNumber()
  totalAmount!: number;

  @IsDateString()
  paymentDate!: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PayslipItemDto)
  @IsOptional()
  items?: PayslipItemDto[];
}