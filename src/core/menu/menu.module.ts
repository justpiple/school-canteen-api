import { Module } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";
import { PrismaModule } from "src/lib/prisma/prisma.module";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [MenuController],
  exports: [MenuService],
  providers: [MenuService],
})
export class MenuModule {}
