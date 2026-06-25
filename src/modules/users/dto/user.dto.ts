import { IsString, IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nationalCode!: string;

  @IsString()
  personnelCode!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  level!: number;

  @IsString()
  @IsOptional()
  role?: string;

  @IsOptional()
  @IsString()
  provinceId?: string;

  @IsOptional()
  @IsString()
  centerId?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  supervisorId?: string;
}

export class ApproveUserDto {
  @IsString()
  userId!: string;

  @IsEnum(['approve', 'reject'])
  action!: 'approve' | 'reject';

  @IsString()
  @IsOptional()
  reason?: string;
}