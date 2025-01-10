import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/lib/prisma/prisma.service";
import { CreateMenuDto } from "./dto/createMenu.dto";
import { UpdateMenuDto } from "./dto/updateMenu.dto";
import { MenuWithDiscountType, MenuWithDiscountsType } from "./menu.types";
import { Role } from "@prisma/client";

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async getStandForUser(userId: string) {
    return this.prisma.stand.findUnique({
      where: { ownerId: userId },
    });
  }

  async verifyAdminPermissions(userId: string, menu: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role === Role.SUPERADMIN) {
      return;
    }

    const stand = await this.getStandForUser(userId);
    if (stand && menu.standId !== stand.id) {
      throw new ForbiddenException(
        "You do not have permission to access or modify this menu.",
      );
    }
  }

  async create(createMenuDto: CreateMenuDto, userId: string) {
    const stand = await this.getStandForUser(userId);

    if (!stand) {
      throw new NotFoundException("Stand not found for this user.");
    }

    const menu = await this.prisma.menu.create({
      data: {
        ...createMenuDto,
        standId: stand.id,
      },
    });

    return menu;
  }

  async findAllByUser(userId: string) {
    const menus = await this.prisma.menu.findMany({
      where: {
        stand: { ownerId: userId },
      },
    });

    return menus;
  }
  async findAll(standId: number) {
    const menus = await this.prisma.menu.findMany({
      where: {
        standId: standId,
      },
      include: {
        discounts: {
          where: {
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
        },
      },
    });

    return this.applyActiveDiscounts(menus);
  }

  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
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
      throw new NotFoundException(`Menu with ID '${id}' not found.`);
    }

    return this.applyActiveDiscounts([menu])[0];
  }

  async update(id: number, updateMenuDto: UpdateMenuDto, userId: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID '${id}' not found.`);
    }

    await this.verifyAdminPermissions(userId, menu);

    return this.prisma.menu.update({
      where: { id },
      data: updateMenuDto,
    });
  }

  async remove(id: number, userId: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID '${id}' not found.`);
    }

    await this.verifyAdminPermissions(userId, menu);

    return this.prisma.menu.delete({
      where: { id },
    });
  }

  private applyActiveDiscounts(
    menus: MenuWithDiscountsType[],
  ): MenuWithDiscountType[] {
    return menus.map((menu) => {
      const menuDiscounts = menu.discounts;
      const { discounts, ...menuWithoutDiscounts } = menu; // eslint-disable-line @typescript-eslint/no-unused-vars

      if (menuDiscounts.length > 0) {
        const highestDiscount = menuDiscounts.reduce((prev, current) =>
          prev.percentage > current.percentage ? prev : current,
        );
        return { ...menuWithoutDiscounts, discount: highestDiscount };
      }

      return menuWithoutDiscounts;
    });
  }
}
