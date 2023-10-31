import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/role.enum';
import { ROLES_KEY } from '../decorator';

//Dùng để bảo vệ route trước khi xử lí request
//Trường hợp này sẽ bắt route từ decorator
//Check điều kiện của route -> hợp lệ thì cho thực hiện tiếp

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role) =>
      user.role?.includes(role.toString().toUpperCase()),
    );
  }
}
