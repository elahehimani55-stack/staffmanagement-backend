import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { Ticket } from './ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ticket_steps')
export class TicketStep {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  ticketId!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  doneBy!: string;

  @ManyToOne(() => Ticket)
  @JoinColumn({ name: 'ticketId' })
  ticket!: Ticket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'doneBy' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}