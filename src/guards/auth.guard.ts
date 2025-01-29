import { AuthType } from '@/modules/auth/constants/auth-type.constant';
import { IS_PUBLIC_KEY } from '@/shared/decorators/public.recorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { IAuthGuard, Type } from '@nestjs/passport';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export const AuthGuard = (strategies: AuthType[]): Type<IAuthGuard> => {
  @Injectable()
  class _AuthGuard extends NestAuthGuard(strategies) {
    constructor(private readonly reflector: Reflector) {
      super();
    }

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (isPublic) {
        return true;
      }

      return super.canActivate(context);
    }
  }

  return _AuthGuard;
};
