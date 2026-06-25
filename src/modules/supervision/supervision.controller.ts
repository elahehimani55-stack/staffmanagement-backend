import {
  Controller, Get, Param, Query,
  UseGuards, Req,
} from '@nestjs/common';
import { SupervisionService } from './supervision.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('supervision')
@UseGuards(JwtAuthGuard)
export class SupervisionController {
  constructor(private supervisionService: SupervisionService) {}

  // لیست کاربران تحت نظارت مستقیم
  @Get('subordinates')
  getSubordinates(@Req() req) {
    return this.supervisionService.getSubordinates(req.user.id);
  }

  // جستجوی کاربران تحت نظارت
  @Get('subordinates/search')
  searchSubordinates(@Req() req, @Query('q') query: string) {
    return this.supervisionService.searchSubordinates(req.user.id, query);
  }

  // اطلاعات کامل یه زیردست
  @Get('subordinates/:id')
  getSubordinateDetails(@Req() req, @Param('id') id: string) {
    return this.supervisionService.getSubordinateDetails(req.user, id);
  }

  // کاربران تحت نظارت یه زیردست (برای drill down)
  @Get('subordinates/:id/team')
  getSubordinateTeam(@Param('id') id: string) {
    return this.supervisionService.getSubordinates(id);
  }
}