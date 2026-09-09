import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenError } from '../../errors/app.exception.js';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const requiredRoles = this.reflector.getAllAndOverride<'agent' | 'moderator'>('roles', [context.getHandler(), context.getClass()]);
      if (!requiredRoles) return true;

      const request = context.switchToHttp().getRequest();
      const user = request.user;
      
      if (!user || !requiredRoles.includes(user.role)) {
          throw new ForbiddenError('Not enough rights');
      }

      return true;
    }
}
