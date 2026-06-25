import { IsString, IsDateString, IsOptional, IsArray } from 'class-validator';

export class CreateMeetingDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  agenda?: string;

  @IsDateString()
  startTime!: Date;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  onlineLink?: string;

  @IsArray()
  @IsOptional()
  participantIds?: string[];
}

export class AddMeetingFileDto {
  @IsString()
  meetingId!: string;

  @IsString()
  fileUrl!: string;

  @IsString()
  @IsOptional()
  description?: string;
}