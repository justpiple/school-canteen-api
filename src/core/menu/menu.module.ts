import { Module } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { PrismaService } from "src/lib/prisma/prisma.service";

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [MenuController],
  providers: [MenuService, PrismaService],
})
export class MenuModule {}
