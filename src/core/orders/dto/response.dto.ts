// order-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class OrderItemDto {
  @ApiProperty({
    example: 3066,
    description: "The unique identifier of the order item",
  })
  id: number;

  @ApiProperty({
    example: 381,
    description: "The ID of the order this item belongs to",
  })
  orderId: number;

  @ApiProperty({
    example: 190,
    description: "The ID of the menu item",
  })
  menuId: number;

  @ApiProperty({
    example: "Mie Goreng Jawa",
    description: "The name of the menu item",
  })
  menuName: string;

  @ApiProperty({
    example: 1,
    description: "The quantity of the menu item",
  })
  quantity: number;

  @ApiProperty({
    example: 13000,
    description: "The price of the menu item",
  })
  price: number;
}

export class StandDto {
  @ApiProperty({
    example: "Kedai Barokah",
    description: "The name of the stand",
  })
  standName: string;
}

export class StudentDto {
  @ApiProperty({
    example: "Mustika Pranowo",
    description: "The name of the student",
  })
  name: string;
}

export class UserDto {
  @ApiProperty({
    type: StudentDto,
    description: "The student details of the user",
  })
  student: StudentDto;
}

export class OrderDto {
  @ApiProperty({
    example: 381,
    description: "The unique identifier of the order",
  })
  id: number;

  @ApiProperty({
    example: "0165f275-1936-49fe-9c38-a02bd918bb23",
    description: "The ID of the user who placed the order",
  })
  userId: string;

  @ApiProperty({
    example: 75,
    description: "The ID of the stand where the order was placed",
  })
  standId: number;

  @ApiProperty({
    example: "PENDING",
    description: "The status of the order",
  })
  status: string;

  @ApiProperty({
    example: "2025-01-09T22:38:00.509Z",
    description: "The timestamp when the order was created",
  })
  createdAt: string;

  @ApiProperty({
    example: "2025-01-09T22:38:00.509Z",
    description: "The timestamp when the order was last updated",
  })
  updatedAt: string;

  @ApiProperty({
    type: [OrderItemDto],
    description: "The list of items in the order",
  })
  items: OrderItemDto[];

  @ApiProperty({
    type: StandDto,
    description: "The details of the stand",
  })
  stand: StandDto;

  @ApiProperty({
    type: UserDto,
    description: "The details of the user who placed the order",
  })
  user: UserDto;
}

export class GetOrdersResponseDto {
  @ApiProperty({
    example: "success",
    description: "The status of the response",
  })
  status: string;

  @ApiProperty({
    example: "Operation successful",
    description: "The message of the response",
  })
  message: string;

  @ApiProperty({
    example: 200,
    description: "The status code of the response",
  })
  statusCode: number;

  @ApiProperty({
    type: [OrderDto],
    description: "The list of orders",
  })
  data: OrderDto[];
}
