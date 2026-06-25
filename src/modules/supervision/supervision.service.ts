import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRelation, RelationType } from './entities/user-relation.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SupervisionService {
  constructor(
    @InjectRepository(UserRelation)
    private relationsRepo: Repository<UserRelation>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createRelation(managerId: string, subordinateId: string) {
    const existing = await this.relationsRepo.findOne({
      where: { managerId, subordinateId },
    });

    if (existing) return existing;

    const relation = this.relationsRepo.create({
      managerId,
      subordinateId,
      relationType: RelationType.DIRECT,
    });

    return this.relationsRepo.save(relation);
  }

  async getSubordinates(managerId: string) {
    // کاربرانی که رابطه سازمانی دارن
    const relations = await this.relationsRepo.find({
      where: { managerId, relationType: RelationType.DIRECT },
    });

    // کاربرانی که مستقیم توسط این مدیر ساخته شدن (حتی pending)
    const createdByManager = await this.usersRepo.find({
      where: { createdBy: managerId },
    });

    const subordinateIds = relations.map((r) => r.subordinateId);

    // ترکیب هر دو لیست بدون تکرار
    const allIds = [
      ...new Set([
        ...subordinateIds,
        ...createdByManager.map((u) => u.id),
      ]),
    ];

    if (allIds.length === 0) return [];

    return this.usersRepo
      .createQueryBuilder('u')
      .select([
        'u.id', 'u.firstName', 'u.lastName',
        'u.nationalCode', 'u.personnelCode',
        'u.level', 'u.role', 'u.status', 'u.phone',
      ])
      .whereInIds(allIds)
      .getMany();
  }

  async getSubordinateDetails(manager: User, subordinateId: string) {
    const relation = await this.relationsRepo.findOne({
      where: { managerId: manager.id, subordinateId },
    });

    if (!relation) throw new ForbiddenException('این کاربر زیردست شما نیست');

    const user = await this.usersRepo
      .createQueryBuilder('u')
      .select([
        'u.id', 'u.firstName', 'u.lastName', 'u.nationalCode',
        'u.personnelCode', 'u.phone', 'u.level', 'u.role',
        'u.status', 'u.createdAt',
      ])
      .where('u.id = :id', { id: subordinateId })
      .getOne();

    if (!user) throw new NotFoundException('کاربر یافت نشد');

    const subordinateRelations = await this.relationsRepo.find({
      where: { managerId: subordinateId },
    });

    return {
      ...user,
      hasSubordinates: subordinateRelations.length > 0,
      subordinatesCount: subordinateRelations.length,
    };
  }

  async searchSubordinates(managerId: string, query: string) {
    const relations = await this.relationsRepo.find({
      where: { managerId },
    });

    const subordinateIds = relations.map((r) => r.subordinateId);
    if (subordinateIds.length === 0) return [];

    return this.usersRepo
      .createQueryBuilder('u')
      .select([
        'u.id', 'u.firstName', 'u.lastName',
        'u.nationalCode', 'u.level', 'u.role',
      ])
      .whereInIds(subordinateIds)
      .andWhere(
        '(u.firstName LIKE :q OR u.lastName LIKE :q OR u.role LIKE :q)',
        { q: `%${query}%` },
      )
      .getMany();
  }
}