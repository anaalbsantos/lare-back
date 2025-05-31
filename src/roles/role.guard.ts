import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    console.log('Role guard - Request user:', request.user);

    if (!request.user?.role) {
      console.log('Role guard - No user role found');
      return false;
    }

    const hasRole = requiredRoles.some((role) => request.user!.role === role);
    console.log('Role guard - Has required role:', hasRole);
    return hasRole;
  }
}
