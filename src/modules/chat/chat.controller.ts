import {
  Controller, Get, Post, Body,
  Param, UseGuards, Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  getConversations(@Req() req) {
    return this.chatService.getMyConversations(req.user.id);
  }

  @Post('conversations/start')
  startConversation(@Req() req, @Body('targetUserId') targetUserId: string) {
    return this.chatService.createPrivateConversation(req.user, targetUserId);
  }

  @Post('requests/send')
  sendRequest(@Req() req, @Body('toUserId') toUserId: string) {
    return this.chatService.sendChatRequest(req.user, toUserId);
  }

  @Post('requests/:id/respond')
  respondRequest(
    @Req() req,
    @Param('id') id: string,
    @Body('accept') accept: boolean,
  ) {
    return this.chatService.respondToRequest(req.user, id, accept);
  }

  @Get('conversations/:id/messages')
  getMessages(@Req() req, @Param('id') id: string) {
    return this.chatService.getMessages(req.user.id, id);
  }
}