import { Module } from "@nestjs/common";
import { DiscountsService } from "./discounts.service";
import { DiscountsController } from "./discounts.controller";
import { PrismaModule } from "../../lib/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [DiscountsController],
  exports: [DiscountsService],
  providers: [DiscountsService],
})
export class DiscountsModule {}
