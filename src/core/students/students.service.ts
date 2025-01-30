import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../lib/prisma/prisma.service";
import { CreateStudentDto } from "./dto/createStudent.dto";
import { UpdateStudentDto } from "./dto/updateStudent.dto";

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto, userId: string) {
    return this.prisma.student.create({
      data: { ...createStudentDto, userId },
    });
  }

  async findOne(id: string) {
    const student = await this.prisma.student.findFirst({
      where: { OR: [{ id }, { userId: id }] },
    });
    if (!student) {
      throw new NotFoundException("Student not found");
    }
    return student;
  }

  async findOneWithoutThrow(id: string) {
    const student = await this.prisma.student.findFirst({
      where: { OR: [{ id }, { userId: id }] },
    });

    return student;
  }

  async update(id: string, updateStudentProfileDto: UpdateStudentDto) {
    const student = await this.findOne(id);
    return this.prisma.student.update({
      where: { id: student.id },
      data: updateStudentProfileDto,
    });
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    return this.prisma.student.delete({
      where: { id: student.id },
    });
  }
}
