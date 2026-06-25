import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, ConversationType } from './entities/conversation.entity';
import { Message, MessageType } from './entities/message.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { ConversationRequest, RequestStatus } from './entities/conversation-request.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private messagesRepo: Repository<Message>,
    @InjectRepository(ConversationParticipant)
    private participantsRepo: Repository<ConversationParticipant>,
    @InjectRepository(ConversationRequest)
    private requestsRepo: Repository<ConversationRequest>,
  ) {}

  // گرفتن لیست گفتگوهای کاربر
  async getMyConversations(userId: string) {
    const participants = await this.participantsRepo.find({
      where: { userId },
      relations: {conversation :true },
    });
    return participants.map((p) => p.conversation);
  }

  // ساخت گفتگوی خصوصی
  async createPrivateConversation(user: User, targetUserId: string) {
    // چک کن آیا گفتگو قبلاً وجود داره
    const existing = await this.participantsRepo
      .createQueryBuilder('p')
      .innerJoin(
        'conversation_participants',
        'p2',
        'p2.conversationId = p.conversationId AND p2.userId = :targetId',
        { targetId: targetUserId },
      )
      .where('p.userId = :userId', { userId: user.id })
      .getOne();

    if (existing) {
      return { conversationId: existing.conversationId };
    }

    // ساخت گفتگو جدید
    const conversation = this.conversationsRepo.create({
      type: ConversationType.PRIVATE,
    });
    await this.conversationsRepo.save(conversation);

    // اضافه کردن هر دو نفر
    await this.participantsRepo.save([
      this.participantsRepo.create({
        conversationId: conversation.id,
        userId: user.id,
      }),
      this.participantsRepo.create({
        conversationId: conversation.id,
        userId: targetUserId,
      }),
    ]);

    return { conversationId: conversation.id };
  }

  // ارسال درخواست گفتگو
  async sendChatRequest(fromUser: User, toUserId: string) {
    const existing = await this.requestsRepo.findOne({
      where: { fromUserId: fromUser.id, toUserId, status: RequestStatus.PENDING },
    });

    if (existing) return { message: 'درخواست قبلاً ارسال شده' };

    const request = this.requestsRepo.create({
      fromUserId: fromUser.id,
      toUserId,
    });

    await this.requestsRepo.save(request);
    return { message: 'درخواست گفتگو ارسال شد', requestId: request.id };
  }

  // پاسخ به درخواست گفتگو
  async respondToRequest(user: User, requestId: string, accept: boolean) {
    const request = await this.requestsRepo.findOne({
      where: { id: requestId, toUserId: user.id },
    });

    if (!request) throw new NotFoundException('درخواست یافت نشد');

    if (accept) {
      request.status = RequestStatus.APPROVED;
      await this.requestsRepo.save(request);
      return this.createPrivateConversation(user, request.fromUserId);
    } else {
      request.status = RequestStatus.REJECTED;
      await this.requestsRepo.save(request);
      return { message: 'درخواست رد شد' };
    }
  }

  // گرفتن پیام‌های یه گفتگو
  async getMessages(userId: string, conversationId: string) {
    const isParticipant = await this.participantsRepo.findOne({
      where: { userId, conversationId },
    });

    if (!isParticipant) throw new ForbiddenException('دسترسی ندارید');

    return this.messagesRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      take: 50,
    });
  }

  // ذخیره پیام جدید
  async saveMessage(
    senderId: string,
    conversationId: string,
    content: string,
    type: MessageType = MessageType.TEXT,
  ) {
    const message = this.messagesRepo.create({
      senderId,
      conversationId,
      content,
      type,
    });
    return this.messagesRepo.save(message);
  }
}