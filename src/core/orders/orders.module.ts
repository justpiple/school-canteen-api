import { Module } from "@nestjs/common";
import { OrderService } from "./orders.service";
import { OrderController } from "./orders.controller";
import { PrismaModule } from "src/lib/prisma/prisma.module"; // Pastikan path ini sesuai dengan struktur proyek Anda

@Module({
  imports: [PrismaModule],
  exports: [OrderService],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
