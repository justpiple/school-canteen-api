import { Prisma } from "@prisma/client";

export const UserWithoutPassword: Prisma.UserSelect = {
  id: true,
  role: true,
  username: true,
};
