import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/lib/prisma/prisma.service";
import { CreateDiscountDto } from "./dto/createDiscount.dto";
import { UpdateDiscountDto } from "./dto/updateDiscount.dto";
import { Discount } from "@prisma/client";

@Injectable()
export class DiscountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    const { menus, standId, ...discountData } = createDiscountDto;

    return this.prisma.discount.create({
      data: {
        ...discountData,
        stand: { connect: { id: standId } },
        menus: {
          connect: menus?.map((item) => ({ id: item })),
        },
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
    const { menus, ...updateDiscount } = updateDiscountDto;

    if (menus) {
      const existingMenus = await this.prisma.menu.findMany({
        where: { id: { in: menus } },
        select: { id: true },
      });

      const existingMenuIds = existingMenus.map((menu) => menu.id);

      if (existingMenuIds.length !== menus.length) {
        throw new Error("One or more menu IDs do not exist.");
      }

      await this.prisma.discount.update({
        where: { id },
        data: { menus: { set: [] } },
      });

      return await this.prisma.discount.update({
        where: { id },
        data: {
          ...updateDiscount,
          menus: {
            connect: menus.map((item) => ({ id: item })),
          },
        },
      });
    }

    return await this.prisma.discount.update({
      where: { id },
      data: updateDiscount,
    });
  }

  async remove(id: number) {
    return this.prisma.discount.delete({
      where: { id },
    });
  }
}
