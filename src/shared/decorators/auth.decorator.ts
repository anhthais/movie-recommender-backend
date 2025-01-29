import { AuthType } from '@/modules/auth/constants/auth-type.constant';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';

type AuthDecoratorOptions = {
  strategies?: AuthType[];
};

export const Auth = (
  { strategies = [AuthType.JWT, AuthType.LOCAL] }: AuthDecoratorOptions = {
    strategies: [AuthType.JWT, AuthType.LOCAL],
  },
): MethodDecorator & ClassDecorator => {
  return applyDecorators(UseGuards(AuthGuard(strategies)));
};
