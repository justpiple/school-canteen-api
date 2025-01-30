import { Module } from "@nestjs/common";
import { StandsController } from "./stands.controller";
import { StandsService } from "./stands.service";
import { PrismaModule } from "../../lib/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [StandsController],
  exports: [StandsService],
  providers: [StandsService],
})
export class StandsModule {}
