import { Module } from "@nestjs/common";
import { DiscountsService } from "./discounts.service";
import { DiscountsController } from "./discounts.controller";
import { PrismaService } from "src/lib/prisma/prisma.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [DiscountsController],
  providers: [DiscountsService, PrismaService],
})
export class DiscountsModule {}
