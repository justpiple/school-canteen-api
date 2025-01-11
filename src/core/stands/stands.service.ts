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
    return this.prisma.stand.findMany({ where: { ownerId: { not: null } } });
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
  async getStandStats(userId: string) {
    const stand = await this.prisma.stand.findUnique({
      where: { ownerId: userId },
    });

    if (!stand) {
      throw new NotFoundException("You don't have stand.");
    }

    const currentDate = new Date();
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 11,
      1,
    );

    const orders = await this.prisma.order.findMany({
      where: {
        stand: { ownerId: userId },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
    });

    const incomeData = Array(12)
      .fill(0)
      .map((_, index) => {
        const monthStart = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + index,
          1,
        );
        const monthEnd = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + index + 1,
          0,
        );

        const total = orders
          .filter(
            (order) =>
              order.createdAt >= monthStart && order.createdAt <= monthEnd,
          )
          .reduce((acc, order) => {
            return (
              acc +
              order.items.reduce((itemAcc, item) => itemAcc + item.price, 0)
            );
          }, 0);

        return {
          month: monthStart.toLocaleString("default", { month: "long" }),
          year: monthStart.getFullYear(),
          total,
        };
      });

    const totalOrders = orders.length;

    const totalIncome = incomeData.reduce((acc, curr) => acc + curr.total, 0);
    const averageIncomePerOrder =
      totalOrders > 0 ? totalIncome / totalOrders : 0;

    const totalItemsSold = orders.reduce(
      (acc, order) =>
        acc + order.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0),
      0,
    );

    const topSellingMenus = await this.prisma.orderItem.groupBy({
      by: ["menuId"],
      where: {
        order: {
          stand: { ownerId: userId },
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    const menuDetails = await Promise.all(
      topSellingMenus.map(async (menu) => {
        const menuInfo = await this.prisma.menu.findUnique({
          where: { id: menu.menuId },
          select: { name: true },
        });
        return {
          menuId: menu.menuId,
          menuName: menuInfo?.name,
          totalSold: menu._sum.quantity,
          totalIncome: menu._sum.price,
        };
      }),
    );

    return {
      monthlyIncome: incomeData,
      totalOrders,
      averageIncomePerOrder,
      totalItemsSold,
      topSellingMenus: menuDetails,
    };
  }
}
