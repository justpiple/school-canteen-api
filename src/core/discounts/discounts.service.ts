import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma/prisma.service";
import { CreateDiscountDto } from "./dto/createDiscount.dto";
import { UpdateDiscountDto } from "./dto/updateDiscount.dto";
import { Discount } from "@prisma/client";

@Injectable()
export class DiscountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    const { standId, ...discountData } = createDiscountDto;

    return this.prisma.discount.create({
      data: {
        ...discountData,
        stand: { connect: { id: standId } },
      },
    });
  }

  async findAll() {
    return this.prisma.discount.findMany();
  }

  async findByStand(userId: string) {
    return this.prisma.discount.findMany({
      where: { stand: { ownerId: userId } },
    });
  }

  async findOne(id: number) {
    return this.prisma.discount.findUnique({
      where: { id },
      include: { menus: true },
    });
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    return this.prisma.discount.update({
      where: { id },
      data: updateDiscountDto,
    });
  }

  async remove(id: number) {
    return this.prisma.discount.delete({
      where: { id },
    });
  }
}
