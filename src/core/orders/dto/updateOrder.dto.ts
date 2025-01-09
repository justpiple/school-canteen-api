import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { OrderStatus } from "@prisma/client";

export class UpdateOrderDto {
  @ApiProperty({
    description: "New status of the order",
    enum: OrderStatus,
    example: OrderStatus.COOKING,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
