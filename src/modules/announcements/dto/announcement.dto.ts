import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsNumber()
  @IsOptional()
  targetLevel?: number;

  @IsArray()
  @IsOptional()
  targetUserIds?: string[];

  @IsString()
  @IsOptional()
  fileUrl?: string;
}