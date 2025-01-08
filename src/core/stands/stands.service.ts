import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma/prisma.service";
import { CreateStandDto } from "./dto/createStand.dto";
import { UpdateStandDto } from "./dto/updateStand.dto";

@Injectable()
export class StandsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStandDto: CreateStandDto, userId: string) {
    return this.prisma.stand.create({
      data: {
        ...createStandDto,
        ownerId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.stand.findMany();
  }

  async findOne(id: number) {
    const stand = await this.prisma.stand.findUnique({ where: { id } });
    if (!stand) {
      throw new NotFoundException(`Stand with id ${id} not found.`);
    }
    return stand;
  }

  async update(id: number, updateStandDto: UpdateStandDto, userId: string) {
    const stand = await this.prisma.stand.findUnique({ where: { id } });

    if (!stand) {
      throw new NotFoundException(`Stand with id ${id} not found.`);
    }

    if (stand.ownerId !== userId) {
      throw new NotFoundException("You are not the owner of this stand.");
    }

    return this.prisma.stand.update({
      where: { id },
      data: updateStandDto,
    });
  }

  async remove(id: number, userId: string) {
    const stand = await this.prisma.stand.findUnique({ where: { id } });

    if (!stand) {
      throw new NotFoundException(`Stand with id ${id} not found.`);
    }

    if (stand.ownerId !== userId) {
      throw new NotFoundException("You are not the owner of this stand.");
    }

    return this.prisma.stand.delete({
      where: { id },
    });
  }
}
