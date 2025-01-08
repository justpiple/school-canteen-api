import { Discount, Prisma } from "@prisma/client";

export type MenuWithDiscountsType = Prisma.MenuGetPayload<{
  include: { discounts: true };
}>;

export type MenuWithDiscountType = Prisma.MenuGetPayload<{}> & {
  discount?: Discount;
};
