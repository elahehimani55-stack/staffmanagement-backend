import {
  Controller, Get, Post, Delete,
  Body, Param, Query,
  UseGuards, Req,
} from '@nestjs/common';
import { SharedSpaceService } from './shared-space.service';
import { CreateFolderDto, UploadFileDto } from './dto/shared-space.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('shared-space')
@UseGuards(JwtAuthGuard)
export class SharedSpaceController {
  constructor(private sharedSpaceService: SharedSpaceService) {}

  @Get('folders')
  getFolders(
    @Req() req: { user: User },
    @Query('parentId') parentId?: string,
  ) {
    return this.sharedSpaceService.getFolders(req.user, parentId);
  }

  @Post('folders')
  createFolder(@Req() req: { user: User }, @Body() dto: CreateFolderDto) {
    return this.sharedSpaceService.createFolder(req.user, dto);
  }

  @Get('folders/:id')
  getFolderContents(@Req() req: { user: User }, @Param('id') id: string) {
    return this.sharedSpaceService.getFolderContents(req.user, id);
  }

  @Delete('folders/:id')
  deleteFolder(@Req() req: { user: User }, @Param('id') id: string) {
    return this.sharedSpaceService.deleteFolder(req.user, id);
  }

  @Post('files')
  uploadFile(@Req() req: { user: User }, @Body() dto: UploadFileDto) {
    return this.sharedSpaceService.uploadFile(req.user, dto);
  }

  @Delete('files/:id')
  deleteFile(@Req() req: { user: User }, @Param('id') id: string) {
    return this.sharedSpaceService.deleteFile(req.user, id);
  }

  @Get('search')
  search(@Req() req: { user: User }, @Query('q') query: string) {
    return this.sharedSpaceService.searchFiles(req.user, query);
  }
}