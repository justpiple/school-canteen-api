import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "./auth.decorator";
import { UserWithoutPasswordType } from "../users/users.types";
import { Role } from "@prisma/client";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException("User not authorized");

    let payload: UserWithoutPasswordType;
    try {
      payload = await this.jwtService.verifyAsync<UserWithoutPasswordType>(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      request["user"] = payload;
    } catch {
      throw new UnauthorizedException("User not authorized");
    }

    // Check if the route has roles set
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles?.length > 0) {
      // Check if user roles include any of the required roles
      const userRole = payload.role;
      if (!requiredRoles.some((role) => userRole === role)) {
        throw new ForbiddenException(
          "You do not have permission to access this resource",
        );
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
