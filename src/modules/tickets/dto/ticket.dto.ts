import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { TicketPriority } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @IsString()
  assignedTo!: string;

  @IsString()
  @IsOptional()
  supervisorId?: string;

  @IsDateString()
  @IsOptional()
  deadline?: Date;
}

export class AddStepDto {
  @IsString()
  ticketId!: string;

  @IsString()
  description!: string;
}

export class UpdateStatusDto {
  @IsString()
  ticketId!: string;

  @IsEnum(['registered', 'in_progress', 'done', 'closed'])
  status!: string;
}