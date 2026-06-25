import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  fullAddress?: string;
}

export class CreateContractDto {
  @IsString()
  userId!: string;

  @IsString()
  contractNumber!: string;

  @IsString()
  position!: string;

  @IsNumber()
  @IsOptional()
  salary?: number;

  @IsString()
  @IsOptional()
  insuranceStatus?: string;

  @IsDateString()
  startDate!: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  fileUrl?: string;
}

export class CreateEvaluationDto {
  @IsString()
  userId!: string;

  @IsNumber()
  score!: number;

  @IsNumber()
  maxScore!: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  evaluationDate!: Date;
}

export class ObjectionDto {
  @IsString()
  evaluationId!: string;

  @IsString()
  objectionText!: string;
}