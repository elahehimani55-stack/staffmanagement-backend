import {
  Injectable, NotFoundException, ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedFolder } from './entities/shared-folder.entity';
import { SharedFile } from './entities/shared-file.entity';
import { User } from '../users/entities/user.entity';
import { CreateFolderDto, UploadFileDto } from './dto/shared-space.dto';

@Injectable()
export class SharedSpaceService {
  constructor(
    @InjectRepository(SharedFolder)
    private foldersRepo: Repository<SharedFolder>,
    @InjectRepository(SharedFile)
    private filesRepo: Repository<SharedFile>,
  ) {}

  async createFolder(creator: User, dto: CreateFolderDto) {
    const folder = this.foldersRepo.create({
      name: dto.name,
      parentId: dto.parentId,
      description: dto.description,
      minLevelAccess: dto.minLevelAccess ?? creator.level,
      createdBy: creator.id,
    });
    return this.foldersRepo.save(folder);
  }

  async getFolders(user: User, parentId?: string) {
    const query = this.foldersRepo
      .createQueryBuilder('f')
      .where('f.minLevelAccess >= :level', { level: user.level });

    if (parentId) {
      query.andWhere('f.parentId = :parentId', { parentId });
    } else {
      query.andWhere('f.parentId IS NULL');
    }

    return query.orderBy('f.name', 'ASC').getMany();
  }

  async getFolderContents(user: User, folderId: string) {
    const folder = await this.foldersRepo.findOne({
      where: { id: folderId },
    });

    if (!folder) throw new NotFoundException('پوشه یافت نشد');

    if (folder.minLevelAccess < user.level) {
      throw new ForbiddenException('دسترسی به این پوشه ندارید');
    }

    const [subFolders, files] = await Promise.all([
      this.foldersRepo.find({ where: { parentId: folderId } }),
      this.filesRepo.find({
        where: { folderId },
        order: { createdAt: 'DESC' },
      }),
    ]);

    return { folder, subFolders, files };
  }

  async uploadFile(uploader: User, dto: UploadFileDto) {
    const folder = await this.foldersRepo.findOne({
      where: { id: dto.folderId },
    });

    if (!folder) throw new NotFoundException('پوشه یافت نشد');

    if (folder.minLevelAccess < uploader.level) {
      throw new ForbiddenException('دسترسی به این پوشه ندارید');
    }

    const file = this.filesRepo.create({
      ...dto,
      uploadedBy: uploader.id,
    });

    return this.filesRepo.save(file);
  }

  async deleteFile(user: User, fileId: string) {
    const file = await this.filesRepo.findOne({
      where: { id: fileId },
    });

    if (!file) throw new NotFoundException('فایل یافت نشد');

    if (file.uploadedBy !== user.id && user.level > 2) {
      throw new ForbiddenException('مجاز به حذف این فایل نیستید');
    }

    await this.filesRepo.remove(file);
    return { message: 'فایل حذف شد' };
  }

  async deleteFolder(user: User, folderId: string) {
    const folder = await this.foldersRepo.findOne({
      where: { id: folderId },
    });

    if (!folder) throw new NotFoundException('پوشه یافت نشد');

    if (folder.createdBy !== user.id && user.level > 2) {
      throw new ForbiddenException('مجاز به حذف این پوشه نیستید');
    }

    await this.foldersRepo.remove(folder);
    return { message: 'پوشه حذف شد' };
  }

  async searchFiles(user: User, query: string) {
    return this.filesRepo
      .createQueryBuilder('f')
      .innerJoin('shared_folders', 'sf', 'sf.id = f.folderId')
      .where('sf.minLevelAccess >= :level', { level: user.level })
      .andWhere(
        '(f.name LIKE :q OR f.description LIKE :q)',
        { q: `%${query}%` },
      )
      .orderBy('f.createdAt', 'DESC')
      .getMany();
  }
}