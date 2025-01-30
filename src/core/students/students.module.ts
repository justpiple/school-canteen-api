import { Module } from "@nestjs/common";
import { StudentController } from "./students.controller";
import { StudentService } from "./students.service";
import { PrismaModule } from "../../lib/prisma/prisma.module";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [StudentController],
  exports: [StudentService],
  providers: [StudentService],
})
export class StudentModule {}
