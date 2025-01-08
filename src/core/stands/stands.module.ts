import { Module } from "@nestjs/common";
import { StandsController } from "./stands.controller";
import { StandsService } from "./stands.service";
import { PrismaService } from "src/lib/prisma/prisma.service";

@Module({
  controllers: [StandsController],
  providers: [StandsService, PrismaService],
})
export class StandsModule {}
