import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
  UseGuards,
  ParseIntPipe,
  Res,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { OrderService } from "./orders.service";
import { CreateOrderDto } from "./dto/createOrder.dto";
import { UpdateOrderDto } from "./dto/updateOrder.dto";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../auth/roles.decorator";
import { UserWithoutPasswordType } from "../users/users.types";
import { Role } from "@prisma/client";
import { UseAuth } from "../auth/auth.decorator";
import { Response } from "express";

@ApiTags("Orders")
@Controller("orders")
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiResponse({
    status: 201,
    description: "The order has been successfully created.",
    schema: {
      example: {
        status: "success",
        message: "Operation successful",
        statusCode: 201,
        data: {
          order: {
            id: 1,
            userId: "aa62a3a0-1be8-4c16-89cb-602705612cf1",
            standId: 1,
            status: "PENDING",
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
            items: [
              { menuId: 1, quantity: 2, price: 200 },
              { menuId: 2, quantity: 1, price: 100 },
            ],
          },
          totalPrice: 500,
        },
      },
    },
  })
  @Post()
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: "Create a new order" })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.orderService.create(createOrderDto, user.id); // Menggunakan user.id
  }

  @ApiResponse({
    status: 200,
    description: "List of orders of the student or stand.",
    schema: {
      example: {
        status: "success",
        message: "Operation successful",
        statusCode: 200,
        data: [
          {
            id: 1,
            userId: "aa62a3a0-1be8-4c16-89cb-602705612cf1",
            standId: 1,
            status: "PENDING",
            createdAt: "2025-01-09T00:00:00.000Z",
            updatedAt: "2025-01-09T00:00:00.000Z",
            items: [
              { menuId: 1, quantity: 2, price: 200 },
              { menuId: 2, quantity: 1, price: 100 },
            ],
          },
        ],
      },
    },
  })
  @Get()
  @ApiBearerAuth()
  @Roles(Role.STUDENT, Role.ADMIN_STAND)
  @ApiOperation({ summary: "Get all orders of the students or stand" })
  async findAll(@UseAuth() user: UserWithoutPasswordType) {
    return this.orderService.findAll(user.id);
  }

  @ApiResponse({
    status: 200,
    description: "The order status has been successfully updated.",
    schema: {
      example: {
        status: "success",
        message: "Operation successful",
        statusCode: 200,
        data: {
          id: 1,
          userId: "aa62a3a0-1be8-4c16-89cb-602705612cf1",
          standId: 1,
          status: "COOKING",
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
    },
  })
  @Patch(":id")
  @Roles(Role.ADMIN_STAND)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update order status" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.orderService.update(id, updateOrderDto, user.id);
  }

  @ApiResponse({
    status: 200,
    description: "The order has been successfully deleted.",
    schema: {
      example: {
        status: "success",
        message: "Operation successful",
        statusCode: 200,
        data: {
          id: 1,
          userId: "aa62a3a0-1be8-4c16-89cb-602705612cf1",
          standId: 1,
          status: "COOKING",
          createdAt: "2025-01-09T00:00:00.000Z",
          updatedAt: "2025-01-09T00:00:00.000Z",
        },
      },
    },
  })
  @Delete(":id")
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete an order" })
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.orderService.remove(id, user.id);
  }

  @Get(":id/receipt")
  @Roles(Role.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Print receipt for the order" })
  @ApiResponse({
    status: 200,
    description: "Receipt PDF for the order.",
  })
  async printReceipt(
    @Param("id", ParseIntPipe) id: number,
    @UseAuth() user: UserWithoutPasswordType,
    @Res() res: Response,
  ) {
    await this.orderService.generateReceiptPDF(id, res, user.id);
  }
}
