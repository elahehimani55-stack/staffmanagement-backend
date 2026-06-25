import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus, TicketPriority } from './entities/ticket.entity';
import { TicketStep } from './entities/ticket-step.entity';
import { TicketAttachment } from './entities/ticket-attachment.entity';
import { User } from '../users/entities/user.entity';
import { CreateTicketDto, AddStepDto, UpdateStatusDto } from './dto/ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepo: Repository<Ticket>,
    @InjectRepository(TicketStep)
    private stepsRepo: Repository<TicketStep>,
    @InjectRepository(TicketAttachment)
    private attachmentsRepo: Repository<TicketAttachment>,
  ) {}

  async create(creator: User, dto: CreateTicketDto) {
    const ticket = this.ticketsRepo.create({
      title: dto.title,
      description: dto.description,
      priority: dto.priority ?? TicketPriority.MEDIUM,
      createdBy: creator.id,
      assignedTo: dto.assignedTo,
      supervisorId: dto.supervisorId,
      deadline: dto.deadline,
    });

    return this.ticketsRepo.save(ticket);
  }

  async getMyTickets(user: User) {
    return this.ticketsRepo
      .createQueryBuilder('t')
      .where(
        't.createdBy = :id OR t.assignedTo = :id OR t.supervisorId = :id',
        { id: user.id },
      )
      .orderBy('t.createdAt', 'DESC')
      .getMany();
  }

  async getTicketById(user: User, ticketId: string) {
    const ticket = await this.ticketsRepo.findOne({
      where: { id: ticketId },
    });

    if (!ticket) throw new NotFoundException('تیکت یافت نشد');

    if (
      ticket.createdBy !== user.id &&
      ticket.assignedTo !== user.id &&
      ticket.supervisorId !== user.id
    ) {
      throw new ForbiddenException('دسترسی ندارید');
    }

    const steps = await this.stepsRepo.find({
      where: { ticketId },
      order: { createdAt: 'ASC' },
    });

    const attachments = await this.attachmentsRepo.find({
      where: { ticketId },
    });

    return { ...ticket, steps, attachments };
  }

  async addStep(user: User, dto: AddStepDto) {
    const ticket = await this.ticketsRepo.findOne({
      where: { id: dto.ticketId },
    });

    if (!ticket) throw new NotFoundException('تیکت یافت نشد');

    if (ticket.assignedTo !== user.id) {
      throw new ForbiddenException('فقط مسئول تیکت میتواند مرحله اضافه کند');
    }

    const step = this.stepsRepo.create({
      ticketId: dto.ticketId,
      description: dto.description,
      doneBy: user.id,
    });

    return this.stepsRepo.save(step);
  }

  async updateStatus(user: User, dto: UpdateStatusDto) {
    const ticket = await this.ticketsRepo.findOne({
      where: { id: dto.ticketId },
    });

    if (!ticket) throw new NotFoundException('تیکت یافت نشد');

    if (
      ticket.assignedTo !== user.id &&
      ticket.createdBy !== user.id
    ) {
      throw new ForbiddenException('مجاز به تغییر وضعیت نیستید');
    }

    ticket.status = dto.status as TicketStatus;
    return this.ticketsRepo.save(ticket);
  }

  async addAttachment(ticketId: string, fileUrl: string, stepId?: string) {
    const attachment = this.attachmentsRepo.create({
      ticketId,
      fileUrl,
      stepId,
    });
    return this.attachmentsRepo.save(attachment);
  }
}