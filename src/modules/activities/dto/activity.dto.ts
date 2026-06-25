import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  completedAt?: Date;

  @IsArray()
  @IsOptional()
  steps?: string[];

  @IsArray()
  @IsOptional()
  attachments?: string[];
}

export class AddStepDto {
  @IsString()
  activityId!: string;

  @IsString()
  description!: string;
}