import {
  Controller, Post, Get,
  Body, Query, UseGuards,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private storageService: StorageService) {}

  // گرفتن لینک آپلود
  @Post('upload-url')
  getUploadUrl(
    @Body('folder') folder: string,
    @Body('extension') extension: string,
  ) {
    return this.storageService.getUploadUrl(folder, extension);
  }

  // گرفتن لینک دانلود
  @Get('download-url')
  getDownloadUrl(@Query('key') key: string) {
    return this.storageService.getDownloadUrl(key);
  }
}