import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, AccountStatus } from '../users/entities/user.entity';
import { LoginDto, ChangePasswordDto, VerifyOtpDto } from './dto/auth.dto';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
constructor(
  @InjectRepository(User)
  private usersRepo: Repository<User>,
  private jwtService: JwtService,
  private config: ConfigService,
  private otpService: OtpService,
) {}

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { nationalCode: dto.nationalCode },
    });

    if (!user) throw new UnauthorizedException('کاربر یافت نشد');

    if (user.status === AccountStatus.PENDING)
      throw new ForbiddenException('حساب شما در انتظار تأیید است');

    if (user.status !== AccountStatus.ACTIVE)
      throw new ForbiddenException('حساب شما غیرفعال است');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('رمز عبور اشتباه است');

    if (user.mustChangePassword) {
      return { mustChangePassword: true, userId: user.id };
    }

    return this.generateTokens(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('رمز فعلی اشتباه است');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.mustChangePassword = false;
    await this.usersRepo.save(user);

    return this.generateTokens(user);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new UnauthorizedException();

    return this.generateTokens(user);
  }

  async logout(userId: string) {
    await this.usersRepo.update(userId, { refreshToken: '' });
    return { message: 'خروج موفق' };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, level: user.level };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES'),
    });

    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.usersRepo.update(user.id, { refreshToken: hashed });

    return { accessToken, refreshToken };
  }
  async forgotPassword(nationalCode: string) {
  const user = await this.usersRepo.findOne({
    where: { nationalCode },
  });

  if (!user) {
    // برای امنیت، حتی اگه کاربر نبود همین پیام رو بده
    return { message: 'اگر این شماره در سیستم باشد، کد ارسال خواهد شد' };
  }

  if (user.status !== AccountStatus.ACTIVE) {
    return { message: 'اگر این شماره در سیستم باشد، کد ارسال خواهد شد' };
  }

  const otp = this.otpService.generateCode();
  await this.otpService.saveOtp(nationalCode, otp);

  // در محیط واقعی اینجا SMS ارسال میشه
  // فعلاً برای تست توی console چاپ میکنیم
  console.log(`OTP for ${nationalCode}: ${otp}`);

  return { message: 'اگر این شماره در سیستم باشد، کد ارسال خواهد شد' };
}

async verifyOtpAndReset(dto: VerifyOtpDto) {
  const isValid = await this.otpService.verifyOtp(dto.nationalCode, dto.otp);
  if (!isValid) {
    throw new BadRequestException('کد وارد شده اشتباه یا منقضی شده است');
  }

  const user = await this.usersRepo.findOne({
    where: { nationalCode: dto.nationalCode },
  });

  if (!user) throw new BadRequestException('کاربر یافت نشد');

  user.password = await bcrypt.hash(dto.newPassword, 10);
  user.mustChangePassword = false;
  await this.usersRepo.save(user);

  return this.generateTokens(user);
}
}
