import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const LEVEL_KEY = 'requiredLevel';

import { SetMetadata } from '@nestjs/common';
export const RequireLevel = (level: number) =>
  SetMetadata(LEVEL_KEY, level);

@Injectable()
export class LevelGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredLevel = this.reflector.get<number>(
      LEVEL_KEY,
      context.getHandler(),
    );

    if (!requiredLevel) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.level > requiredLevel) {
      throw new ForbiddenException('سطح دسترسی کافی نیست');
    }

    return true;
  }
}