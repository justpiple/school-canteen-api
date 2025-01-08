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
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Prisma, User } from "@prisma/client";
import { UserWithoutPasswordType } from "./users.types";
import { ResponseTemplate } from "../../utils/interceptors/transform.interceptor";
import { UseAuth } from "../auth/auth.decorator";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { UsersService } from "./users.service";
import { encryptData } from "../../utils/encryption.utils";
import { UserWithoutPassword } from "src/utils/selector.utils";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get a user by id", tags: ["users"] })
  async findById(
    @Param("id") id: string,
  ): Promise<ResponseTemplate<UserWithoutPasswordType>> {
    const user = await this.usersService.getUser({ id }, UserWithoutPassword);
    if (!user) throw new NotFoundException(`No user found with id: ${id}`);

    return { message: "Retrieved user successfully", result: user };
  }

  @HttpCode(HttpStatus.OK)
  @Patch("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current user", tags: ["users"] })
  async updateCurrentUser(
    @UseAuth() user: UserWithoutPasswordType,
    @Body() data: UpdateUserDto,
  ) {
    const userUpdateData: Prisma.UserUpdateInput = { ...data };

    if (data.password) {
      const encryptedPassword = await encryptData(data.password);
      userUpdateData.password = encryptedPassword;
    }

    return {
      message: "Updated user successfully",
      result: await this.usersService.updateUser({ id: user.id }, data),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user", tags: ["users"] })
  async getCurrentUser(@UseAuth() user: UserWithoutPasswordType) {
    return {
      message: "Get user successfully",
      result: await this.usersService.getUser({ id: user.id }),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete current user by id",
    tags: ["users"],
  })
  async deleteCurrentUser(
    @Param("id") id: string,
  ): Promise<ResponseTemplate<User>> {
    return {
      message: "Deleted user successfully",
      result: await this.usersService.deleteUser({ id }),
    };
  }
}
