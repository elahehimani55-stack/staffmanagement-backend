import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { Contract } from './entities/contract.entity';
import { JobHistory } from './entities/job-history.entity';
import { Evaluation } from './entities/evaluation.entity';
import { User } from '../users/entities/user.entity';
import {
  UpdateAddressDto,
  CreateContractDto,
  CreateEvaluationDto,
  ObjectionDto,
} from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
    @InjectRepository(Contract)
    private contractRepo: Repository<Contract>,
    @InjectRepository(JobHistory)
    private jobHistoryRepo: Repository<JobHistory>,
    @InjectRepository(Evaluation)
    private evaluationRepo: Repository<Evaluation>,
  ) {}

  // آدرس
  async getAddress(userId: string) {
    return this.addressRepo.findOne({ where: { userId } });
  }

  async updateAddress(userId: string, dto: UpdateAddressDto) {
    const existing = await this.addressRepo.findOne({ where: { userId } });
    if (existing) {
      Object.assign(existing, dto);
      return this.addressRepo.save(existing);
    }
    return this.addressRepo.save(
      this.addressRepo.create({ userId, ...dto }),
    );
  }

  // قراردادها
  async getContracts(userId: string) {
    return this.contractRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createContract(creator: User, dto: CreateContractDto) {
    // غیرفعال کردن قرارداد قبلی
    await this.contractRepo.update(
      { userId: dto.userId, isActive: true },
      { isActive: false },
    );

    return this.contractRepo.save(
      this.contractRepo.create({
        ...dto,
        isActive: true,
      }),
    );
  }

  // سوابق شغلی
  async getJobHistory(userId: string) {
    return this.jobHistoryRepo.find({
      where: { userId },
      order: { startDate: 'DESC' },
    });
  }

  // ارزیابی‌ها
  async getEvaluations(userId: string) {
    return this.evaluationRepo.find({
      where: { userId },
      order: { evaluationDate: 'DESC' },
    });
  }

  async createEvaluation(evaluator: User, dto: CreateEvaluationDto) {
    return this.evaluationRepo.save(
      this.evaluationRepo.create({
        ...dto,
        evaluatorId: evaluator.id,
      }),
    );
  }

  async submitObjection(userId: string, dto: ObjectionDto) {
    const evaluation = await this.evaluationRepo.findOne({
      where: { id: dto.evaluationId, userId },
    });

    if (!evaluation) throw new NotFoundException('ارزیابی یافت نشد');

    evaluation.hasObjection = true;
    evaluation.objectionText = dto.objectionText;
    return this.evaluationRepo.save(evaluation);
  }

  // پروفایل کامل
  async getFullProfile(userId: string) {
    const [address, contracts, jobHistory, evaluations] = await Promise.all([
      this.addressRepo.findOne({ where: { userId } }),
      this.contractRepo.find({ where: { userId, isActive: true } }),
      this.jobHistoryRepo.find({ where: { userId }, order: { startDate: 'DESC' } }),
      this.evaluationRepo.find({ where: { userId }, order: { evaluationDate: 'DESC' } }),
    ]);

    return { address, contracts, jobHistory, evaluations };
  }
}