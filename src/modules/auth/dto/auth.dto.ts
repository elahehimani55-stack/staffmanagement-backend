import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  nationalCode!: string;

  @IsString()
  password!: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'رمز باید شامل حروف بزرگ، کوچک، عدد و علامت باشد',
  })
  newPassword!: string;
}

export class ForgotPasswordDto {
  @IsString()
  nationalCode!: string;
}

export class VerifyOtpDto {
  @IsString()
  nationalCode!: string;

  @IsString()
  otp!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  newPassword!: string;
}