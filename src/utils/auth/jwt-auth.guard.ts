import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: Error | null, user: any, info: any, context: ExecutionContext): any {
    const req = context.switchToHttp().getRequest();

    if (err || !user) {
      console.warn(`Unauthorized access attempt: ${req.ip}`);
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    return user;
  }
}
