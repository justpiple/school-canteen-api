import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Prisma, Role } from "@prisma/client";
import { UserWithoutPasswordType } from "./users.types";
import { UseAuth } from "../auth/auth.decorator";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { UsersService } from "./users.service";
import { encryptData } from "../../utils/encryption.utils";
import { UserWithoutPassword } from "src/utils/selector.utils";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Patch("me")
  @ApiBearerAuth()
  @Roles(Role.SUPERADMIN, Role.ADMIN_STAND, Role.STUDENT)
  @ApiOperation({ summary: "Update current user", tags: ["users"] })
  async updateCurrentUser(
    @UseAuth() user: UserWithoutPasswordType,
    @Body() data: UpdateUserDto,
  ) {
    const userUpdateData: Prisma.UserUpdateInput = { ...data };

    if (data.password.trim()) {
      const encryptedPassword = await encryptData(data.password);
      userUpdateData.password = encryptedPassword;
    }

    // eslint-disable-next-line  @typescript-eslint/no-unuse
    const { password, ...userWithoutPassword } =
      await this.usersService.updateUser({ id: user.id }, data);

    return userWithoutPassword;
  }

  @HttpCode(HttpStatus.OK)
  @Get("me")
  @ApiBearerAuth()
  @Roles(Role.STUDENT, Role.SUPERADMIN, Role.ADMIN_STAND)
  @ApiOperation({ summary: "Get current user", tags: ["users"] })
  getCurrentUser(@UseAuth() user: UserWithoutPasswordType) {
    return this.usersService.getUser({ id: user.id }, UserWithoutPassword);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  @ApiBearerAuth()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({ summary: "Get a user by id", tags: ["users"] })
  async findById(@Param("id") id: string) {
    const user = await this.usersService.getUser({ id }, UserWithoutPassword);
    if (!user) throw new NotFoundException(`No user found with id: ${id}`);

    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Delete(":id")
  @ApiBearerAuth()
  @Roles(Role.SUPERADMIN)
  @ApiOperation({
    summary: "Delete current user by id",
    tags: ["users"],
  })
  deleteCurrentUser(@Param("id") id: string) {
    return this.usersService.deleteUser({ id });
  }
}
