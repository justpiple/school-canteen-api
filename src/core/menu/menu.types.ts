import { Discount, Prisma } from "@prisma/client";

export type MenuWithDiscountsType = Prisma.MenuGetPayload<{
  include: { discounts: true };
}>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type MenuWithDiscountType = Prisma.MenuGetPayload<{}> & {
  discount?: Discount;
};
