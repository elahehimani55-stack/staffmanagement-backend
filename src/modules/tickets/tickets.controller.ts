import {
  Controller, Get, Post, Body,
  Param, UseGuards, Req,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, AddStepDto, UpdateStatusDto } from './dto/ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTicketDto) {
    return this.ticketsService.create(req.user, dto);
  }

  @Get()
  getMyTickets(@Req() req) {
    return this.ticketsService.getMyTickets(req.user);
  }

  @Get(':id')
  getById(@Req() req, @Param('id') id: string) {
    return this.ticketsService.getTicketById(req.user, id);
  }

  @Post('steps')
  addStep(@Req() req, @Body() dto: AddStepDto) {
    return this.ticketsService.addStep(req.user, dto);
  }

  @Post('status')
  updateStatus(@Req() req, @Body() dto: UpdateStatusDto) {
    return this.ticketsService.updateStatus(req.user, dto);
  }
}