import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Prisma, Role } from "@prisma/client";
import { UsersService } from "../users/users.service";
import { compareData, encryptData } from "../../utils/encryption.utils";
import { UserWithoutPasswordType } from "../users/users.types";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(username: string, password: string, role: Role) {
    const findUser = await this.usersService.getUser({ username });
    if (findUser)
      throw new ForbiddenException(
        `User with username ${username} already exists`,
      );

    const data: Prisma.UserCreateInput = {
      username,
      role,
      password: await encryptData(password),
    };

    return await this.usersService.createUser(data);
  }

  async signIn(username: string, pass: string) {
    const findUser = await this.usersService.getUser({ username });
    if (!findUser)
      throw new UnauthorizedException("Username or Password is incorrect");

    const correctPass = await compareData(pass, findUser.password);
    if (!correctPass)
      throw new UnauthorizedException("Username or Password is incorrect");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userInfo } = findUser;

    const payload: UserWithoutPasswordType = userInfo;

    return {
      access_token: await this.jwtService.signAsync(payload),
      ...payload,
    };
  }
}
