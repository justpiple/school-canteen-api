import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/lib/prisma/prisma.service";
import { CreateOrderDto } from "./dto/createOrder.dto";
import { UpdateOrderDto } from "./dto/updateOrder.dto";
import { Prisma, Role } from "@prisma/client";
import * as PDFDocument from "pdfkit";
import { Response } from "express";
import {
  generateFooter,
  generateHeader,
  generateItemsTable,
  generateOrderDetails,
} from "src/utils/pdfkit.utils";

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const itemsWithPrices = await Promise.all(
      createOrderDto.items.map(async (item) => {
        const menu = await this.prisma.menu.findUnique({
          where: { id: item.menuId },
          include: {
            discounts: {
              where: {
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
              },
            },
          },
        });

        if (!menu) {
          throw new NotFoundException(
            `Menu with ID '${item.menuId}' not found.`,
          );
        }

        const price = menu.price * item.quantity;
        const activeDiscounts = menu.discounts;

        let discountAmount = 0;
        if (activeDiscounts.length > 0) {
          const highestDiscount = activeDiscounts.reduce((prev, current) =>
            prev.percentage > current.percentage ? prev : current,
          );
          discountAmount = (highestDiscount.percentage / 100) * price;
        }

        return {
          name: menu.name,
          menuId: item.menuId,
          quantity: item.quantity,
          price: price - discountAmount,
        };
      }),
    );

    const totalPrice = itemsWithPrices.reduce(
      (total, item) => total + item.price,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        userId: userId,
        standId: createOrderDto.standId,
        items: {
          create: itemsWithPrices.map((item) => ({
            menuName: item.name,
            menuId: item.menuId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return { order, totalPrice };
  }

  async findOrderById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { menu: { select: { name: true } } } },
        user: { select: { student: { select: { name: true } } } },
        stand: { select: { standName: true } },
      },
    });
  }

  async findAll(userId: string, month?: number, year?: number) {
    const whereClause: Prisma.OrderWhereInput = {
      OR: [{ userId }, { stand: { ownerId: userId } }],
    };

    const startDate = new Date(year, month === 0 ? 0 : month - 1, 1);
    const endDate = new Date(
      year,
      month === 0 ? 12 : month,
      0,
      23,
      59,
      59,
      999,
    );

    whereClause.createdAt = {
      gte: startDate,
      lte: endDate,
    };

    return this.prisma.order.findMany({
      where: whereClause,
      include: {
        items: true,
        stand: { select: { standName: true } },
        user: { select: { student: { select: { name: true } } } },
      },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found.`);
    }

    const stand = await this.prisma.stand.findUnique({
      where: { ownerId: userId },
    });

    if (!stand || order.standId !== stand.id) {
      throw new ForbiddenException(
        "You do not have permission to update this order.",
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: updateOrderDto.status },
    });
  }

  async remove(id: number, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID '${id}' not found.`);
    }

    // Check if the user is SUPERADMIN
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== Role.SUPERADMIN) {
      throw new ForbiddenException(
        "You do not have permission to delete this order.",
      );
    }

    return this.prisma.order.delete({
      where: { id },
    });
  }

  async generateReceiptPDF(orderId: number, res: Response, userId: string) {
    const order = await this.findOrderById(orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (userId !== order.userId) {
      throw new ForbiddenException("This is not your order.");
    }
    const filename = `receipt-${order.id}.pdf`;
    res.set("Content-disposition", `attachment; filename="${filename}"`);
    res.set("Content-type", "application/pdf");

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
          Title: `Receipt-${order.id} (${order.user.student.name})`,
          Author: "School Canteen System",
        },
      });

      const buffer = [];
      doc.on("data", buffer.push.bind(buffer));
      doc.on("end", () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });

      generateHeader(doc);
      generateOrderDetails(doc, order);
      generateItemsTable(doc, order);
      generateFooter(doc);

      doc.end();
    });

    res.end(pdfBuffer);
  }
}
