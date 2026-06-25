import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { TicketStep } from './entities/ticket-step.entity';
import { TicketAttachment } from './entities/ticket-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketStep, TicketAttachment]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}