import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class OtpService {
  private redis: Redis;

  constructor(private config: ConfigService) {
    const host = this.config.get<string>('REDIS_HOST') ?? 'localhost';
    const port = parseInt(this.config.get<string>('REDIS_PORT') ?? '6379');
    const password = this.config.get<string>('REDIS_PASSWORD');

    this.redis = new Redis({
      host,
      port,
      password,
      tls: password ? {} : undefined, // TLS فقط برای Upstash
    });
  }

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async saveOtp(nationalCode: string, otp: string): Promise<void> {
    await this.redis.setex(`otp:${nationalCode}`, 300, otp);
  }

  async verifyOtp(nationalCode: string, otp: string): Promise<boolean> {
    const stored = await this.redis.get(`otp:${nationalCode}`);
    if (!stored) return false;
    if (stored !== otp) return false;
    await this.redis.del(`otp:${nationalCode}`);
    return true;
  }
}