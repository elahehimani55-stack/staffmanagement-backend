import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  minLevelAccess?: number;
}

export class UploadFileDto {
  @IsString()
  name!: string;

  @IsString()
  folderId!: string;

  @IsString()
  fileUrl!: string;

  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @IsString()
  @IsOptional()
  mimeType?: string;

  @IsString()
  @IsOptional()
  description?: string;
}