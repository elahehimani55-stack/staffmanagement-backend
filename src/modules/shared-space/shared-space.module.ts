import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedSpaceService } from './shared-space.service';
import { SharedSpaceController } from './shared-space.controller';
import { SharedFolder } from './entities/shared-folder.entity';
import { SharedFile } from './entities/shared-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SharedFolder, SharedFile])],
  controllers: [SharedSpaceController],
  providers: [SharedSpaceService],
  exports: [SharedSpaceService],
})
export class SharedSpaceModule {}