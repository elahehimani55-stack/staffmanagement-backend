import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, AccountStatus } from './entities/user.entity';
import { UserApproval, ApprovalAction } from './entities/user-approval.entity';
import { CreateUserDto, ApproveUserDto } from './dto/user.dto';
import { SupervisionService } from '../supervision/supervision.service';
import { Conversation, ConversationType } from '../chat/entities/conversation.entity';
import { Message, MessageType } from '../chat/entities/message.entity';
import { ConversationParticipant } from '../chat/entities/conversation-participant.entity';
import { ORGANIZATION } from '../organization/organization.data';
import { OtpService } from '../auth/otp.service';



@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User)
  private usersRepo: Repository<User>,
  @InjectRepository(UserApproval)
  private approvalsRepo: Repository<UserApproval>,
  @InjectRepository(Conversation)
  private conversationsRepo: Repository<Conversation>,
  @InjectRepository(Message)
  private messagesRepo: Repository<Message>,
  @InjectRepository(ConversationParticipant)
  private participantsRepo: Repository<ConversationParticipant>,
  private supervisionService: SupervisionService,
  private otpService: OtpService,
) {}

  // قانون سلسله مراتب — هر سطح فقط میتونه سطح بعدی رو بسازه
  private canCreateLevel(creatorLevel: number, targetLevel: number): boolean {
    return targetLevel === creatorLevel + 1;
  }

  async createUser(creator: User, dto: CreateUserDto) {
    // چک سلسله مراتب — فقط سطوح پایین‌تر
    if (dto.level <= creator.level) {
      throw new ForbiddenException(
        `شما فقط می‌توانید کاربر با سطح پایین‌تر از خودتان بسازید`,
      );
    }

    const existing = await this.usersRepo.findOne({
      where: { nationalCode: dto.nationalCode },
    });
    if (existing) {
      throw new BadRequestException('این کد ملی قبلاً ثبت شده است');
    }

    const hashedPassword = await bcrypt.hash(dto.personnelCode, 10);

    // اگه سازنده سطح ۱ هست، کاربر نیازی به تأیید نداره
    const isAutoApproved = creator.level === 1;

    const user = this.usersRepo.create({
      ...dto,
      password: hashedPassword,
      status: isAutoApproved ? AccountStatus.ACTIVE : AccountStatus.PENDING,
      mustChangePassword: true,
      createdBy: creator.id,
    });

    await this.usersRepo.save(user);

    // اگه نیاز به تأیید داره، پیام بات بفرست
    if (!isAutoApproved) {
      await this.sendApprovalBotMessage(creator, user);
    } else {
      // رابطه سازمانی برقرار کن
      await this.supervisionService.createRelation(creator.id, user.id);
    }

    return {
      ...user,
      message: isAutoApproved
        ? 'کاربر با موفقیت ایجاد و فعال شد'
        : 'کاربر ایجاد شد و درخواست تأیید ارسال شد',
    };
  }

  private async sendApprovalBotMessage(creator: User, newUser: User) {
    // گفتگوی بات با سازنده (که باید تأیید کنه)
    // ابتدا یه conversation از نوع bot بساز
    const conversation = await this.conversationsRepo.save(
      this.conversationsRepo.create({
        type: ConversationType.BOT,
        name: 'ربات سامانه',
      }),
    );

    // سازنده رو به conversation اضافه کن
    await this.participantsRepo.save(
      this.participantsRepo.create({
        conversationId: conversation.id,
        userId: creator.id,
      }),
    );

    // پیام بات بفرست
    const message = `🔔 درخواست تأیید کاربر جدید

  نام: ${newUser.firstName} ${newUser.lastName}
  کد ملی: ${newUser.nationalCode}
  کد پرسنلی: ${newUser.personnelCode}
  سطح: ${newUser.level}
  نقش: ${newUser.role ?? '—'}

  برای تأیید یا رد این کاربر به بخش «کاربران تحت نظارت» مراجعه کنید.
  شناسه کاربر: ${newUser.id}`;

    await this.messagesRepo.save(
      this.messagesRepo.create({
        conversationId: conversation.id,
        senderId: creator.id,
        content: message,
        type: MessageType.BOT,
      }),
    );
  }

  async approveUser(approver: User, dto: ApproveUserDto) {
    const user = await this.usersRepo.findOne({
      where: { id: dto.userId },
    });

    if (!user) throw new NotFoundException('کاربر یافت نشد');

    if (user.status !== AccountStatus.PENDING) {
      throw new BadRequestException('این حساب در انتظار تأیید نیست');
    }

    // چک سلسله مراتب — تأییدکننده باید سطح بالاتر داشته باشه
    if (approver.level >= user.level) {
      throw new ForbiddenException('شما مجاز به تأیید این حساب نیستید');
    }

    // آپدیت وضعیت کاربر
    user.status =
      dto.action === 'approve'
        ? AccountStatus.ACTIVE
        : AccountStatus.REJECTED;

    await this.usersRepo.save(user);

    // ثبت در تاریخچه تأییدها
    const approval = this.approvalsRepo.create({
      userId: user.id,
      approvedBy: approver.id,
      action:
        dto.action === 'approve'
          ? ApprovalAction.APPROVED
          : ApprovalAction.REJECTED,
      reason: dto.reason,
    });

    await this.approvalsRepo.save(approval);

    // ثبت رابطه سازمانی
    if (dto.action === 'approve') {
      await this.supervisionService.createRelation(approver.id, user.id);
    }
    
    return {
      message:
        dto.action === 'approve'
          ? 'حساب با موفقیت تأیید شد'
          : 'حساب رد شد',
    };
  }

async getPendingUsers() {
  return this.usersRepo
    .createQueryBuilder('user')
    .select([
      'user.id',
      'user.firstName',
      'user.lastName',
      'user.nationalCode',
      'user.level',
      'user.role',
      'user.createdAt',
    ])
    .where('user.status = :status', { status: AccountStatus.PENDING })
    .getMany();
}

 async getMyProfile(userId: string) {
  const user = await this.usersRepo
    .createQueryBuilder('user')
    .select([
      'user.id',
      'user.firstName',
      'user.lastName',
      'user.nationalCode',
      'user.personnelCode',
      'user.phone',
      'user.level',
      'user.role',
      'user.status',
      'user.createdAt',
    ])
    .where('user.id = :id', { id: userId })
    .getOne();

  if (!user) throw new NotFoundException('کاربر یافت نشد');
  return user;
    }

  async searchUsers(currentUser: User, query: string) {
    return this.usersRepo
      .createQueryBuilder('u')
      .select(['u.id', 'u.firstName', 'u.lastName', 'u.role', 'u.level'])
      .where('u.id != :id', { id: currentUser.id })
      .andWhere('u.status = :status', { status: AccountStatus.ACTIVE })
      .andWhere(
        '(u.firstName LIKE :q OR u.lastName LIKE :q OR u.role LIKE :q)',
        { q: `%${query}%` },
      )
      .getMany();
  }  

  getOrganization() {
    return ORGANIZATION;
  }

  async getUsersByDepartment(
    provinceId: string,
    centerId: string,
    department: string,
  ) {
    return this.usersRepo
      .createQueryBuilder('u')
      .select(['u.id', 'u.firstName', 'u.lastName', 'u.role', 'u.level', 'u.department', 'u.status'])
      .where('u.provinceId = :provinceId', { provinceId })
      .andWhere('u.centerId = :centerId', { centerId })
      .andWhere('u.department = :department', { department })
      .andWhere('u.status = :status', { status: AccountStatus.ACTIVE })
      .getMany();
  }


  async requestPhoneChange(user: User) {
    const otp = this.otpService.generateCode();
    await this.otpService.saveOtp(`phone_change_${user.id}`, otp);
    // در محیط واقعی SMS ارسال میشه
    console.log(`OTP for phone change ${user.id}: ${otp}`);
    return { message: 'کد تأیید ارسال شد' };
  }

  async verifyPhoneChange(user: User, newPhone: string, otp: string) {
    const isValid = await this.otpService.verifyOtp(
      `phone_change_${user.id}`,
      otp,
    );
    if (!isValid) {
      throw new BadRequestException('کد اشتباه یا منقضی شده');
    }

    await this.usersRepo.update(user.id, { phone: newPhone });
    return { message: 'شماره موبایل با موفقیت تغییر کرد' };
  }

  async requestPhoneVerify(user: User) {
    if (!user.phone) {
      throw new BadRequestException('شماره موبایلی ثبت نشده');
    }

    const otp = this.otpService.generateCode();
    await this.otpService.saveOtp(`phone_verify_${user.id}`, otp);
    console.log(`OTP for phone verify ${user.id}: ${otp}`);
    return { message: 'کد تأیید به شماره فعلی ارسال شد' };
  }

  async confirmPhoneVerify(user: User, otp: string) {
    const isValid = await this.otpService.verifyOtp(
      `phone_verify_${user.id}`,
      otp,
    );
    if (!isValid) {
      throw new BadRequestException('کد اشتباه یا منقضی شده');
    }
    return { message: 'شماره موبایل تأیید شد' };
  }
}