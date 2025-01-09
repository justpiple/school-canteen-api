import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsArray } from "class-validator";

export class CreateOrderDto {
  @ApiProperty({
    description: "ID of the stand where the order is placed",
    example: 1,
  })
  @IsInt()
  standId: number;

  @ApiProperty({
    description: "List of order items",
    example: [
      { menuId: 1, quantity: 2 },
      { menuId: 2, quantity: 1 },
    ],
  })
  @IsArray()
  items: { menuId: number; quantity: number }[];
}
