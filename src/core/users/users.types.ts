import { Prisma } from "@prisma/client";

export type UserWithoutPasswordType = Prisma.UserGetPayload<{
  select: { id: true; role: true; username: true };
}>;
