import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, ApproveUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ساخت کاربر جدید
  @Post('create')
  createUser(@Req() req, @Body() dto: CreateUserDto) {
    return this.usersService.createUser(req.user, dto);
  }

  // تأیید یا رد حساب
  @Post('approve')
  approveUser(@Req() req, @Body() dto: ApproveUserDto) {
    return this.usersService.approveUser(req.user, dto);
  }

  // لیست حساب‌های در انتظار تأیید
  @Get('pending')
  getPending() {
    return this.usersService.getPendingUsers();
  }

  // پروفایل خودم
  @Get('me')
  getMe(@Req() req) {
    return this.usersService.getMyProfile(req.user.id);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  searchUsers(@Query('q') query: string, @Req() req) {
    return this.usersService.searchUsers(req.user, query);
  }

  @Get('organization')
    getOrganization() {
      return this.usersService.getOrganization();
    }

    @Get('by-department')
    @UseGuards(JwtAuthGuard)
    getUsersByDepartment(
      @Query('provinceId') provinceId: string,
      @Query('centerId') centerId: string,
      @Query('department') department: string,
    ) {
      return this.usersService.getUsersByDepartment(provinceId, centerId, department);
    }

  @Post('change-phone/request')
  @UseGuards(JwtAuthGuard)
    requestPhoneChange(@Req() req, @Body('phone') phone: string) {
    return this.usersService.requestPhoneChange(req.user, phone);
  }

  @Post('change-phone/verify')
  @UseGuards(JwtAuthGuard)
  verifyPhoneChange(
    @Req() req,
    @Body('phone') phone: string,
    @Body('otp') otp: string,
  ) {
    return this.usersService.verifyPhoneChange(req.user, phone, otp);
  }

  @Post('verify-phone/request')
  @UseGuards(JwtAuthGuard)
  requestPhoneVerify(@Req() req) {
    return this.usersService.requestPhoneVerify(req.user);
  }

  @Post('verify-phone/confirm')
  @UseGuards(JwtAuthGuard)
  confirmPhoneVerify(@Req() req, @Body('otp') otp: string) {
    return this.usersService.confirmPhoneVerify(req.user, otp);
  }
}