import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../lib/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ) {
    return await this.prismaService.user.findUnique({
      where,
      select,
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return await this.prismaService.user.create({
      data,
    });
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    return await this.prismaService.user.update({ where, data });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    return await this.prismaService.user.delete({ where });
  }
}
