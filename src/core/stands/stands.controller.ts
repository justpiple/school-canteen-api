import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { StandsService } from "./stands.service";
import { CreateStandDto } from "./dto/createStand.dto";
import { UpdateStandDto } from "./dto/updateStand.dto";
import { AllowAnon, UseAuth } from "../auth/auth.decorator";
import { AuthGuard } from "../auth/auth.guard";
import { UserWithoutPasswordType } from "../users/users.types";
import { PrismaService } from "src/lib/prisma/prisma.service";
import { Roles } from "../auth/roles.decorator";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "@prisma/client";

@ApiTags("Stands")
@Controller("stands")
@UseGuards(AuthGuard)
export class StandsController {
  constructor(
    private readonly standsService: StandsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @Roles(Role.ADMIN_STAND)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a new stand",
    description: "Allows an ADMIN_STAND to create a new stand.",
  })
  async create(
    @Body() createStandDto: CreateStandDto,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.standsService.create(createStandDto, user.id);
  }

  @Get("stats")
  @ApiBearerAuth()
  @Roles(Role.ADMIN_STAND)
  @ApiOperation({ summary: "Get statistics for the stand" })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully.",
    example: {
      status: "success",
      message: "Statistics retrieved successfully",
      statusCode: 200,
      data: {
        monthlyIncome: [
          { month: "January", year: 2024, total: 1500.0 },
          { month: "February", year: 2024, total: 2000.0 },
          { month: "March", year: 2024, total: 1800.0 },
          { month: "April", year: 2024, total: 2200.0 },
          { month: "May", year: 2024, total: 2500.0 },
          { month: "June", year: 2024, total: 3000.0 },
          { month: "July", year: 2024, total: 2700.0 },
          { month: "August", year: 2024, total: 3200.0 },
          { month: "September", year: 2024, total: 2900.0 },
          { month: "October", year: 2024, total: 3100.0 },
          { month: "November", year: 2024, total: 3300.0 },
          { month: "December", year: 2024, total: 3500.0 },
        ],
        totalOrders: 120,
        averageIncomePerOrder: 250.0,
        totalItemsSold: 500,
        topSellingMenus: [
          {
            menuId: 1,
            menuName: "Nasi Goreng",
            totalSold: 100,
            totalIncome: 1000.0,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Stand not found.",
  })
  async getStats(@UseAuth() user: UserWithoutPasswordType) {
    return this.standsService.getStandStats(user.id);
  }

  @Get()
  @ApiOperation({
    summary: "Get all stands",
    description: "Retrieves all stands from the database.",
  })
  async findAll() {
    return this.standsService.findAll();
  }

  @Get("me")
  @Roles(Role.ADMIN_STAND)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get own stand",
    description: "Retrieves the stand of the currently logged-in ADMIN_STAND.",
  })
  async getOwnStand(@UseAuth() user: UserWithoutPasswordType) {
    const stand = await this.prisma.stand.findUnique({
      where: { ownerId: user.id },
    });
    if (!stand) {
      throw new NotFoundException("You do not have a stand.");
    }
    return stand;
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get stand by ID",
    description: "Retrieves a specific stand by its ID.",
  })
  @AllowAnon()
  async findOne(@Param("id") id: number) {
    return this.standsService.findOne(id);
  }

  @Patch("me")
  @Roles(Role.ADMIN_STAND)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update own stand",
    description:
      "Allows an ADMIN_STAND to update their own stand's information.",
  })
  async updateOwnStand(
    @Body() updateStandDto: UpdateStandDto,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    const stand = await this.prisma.stand.findUnique({
      where: { ownerId: user.id },
    });
    if (!stand) {
      throw new NotFoundException("You do not have a stand.");
    }
    return this.standsService.update(stand.id, updateStandDto, user.id);
  }

  @Patch(":id")
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a stand by ID",
    description:
      "Allows an ADMIN_STAND to update the information of a specific stand.",
  })
  async update(
    @Param("id") id: number,
    @Body() updateStandDto: UpdateStandDto,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.standsService.update(id, updateStandDto, user.id);
  }

  @Delete(":id")
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a stand by ID",
    description: "Allows an ADMIN_STAND to delete a specific stand.",
  })
  async remove(
    @Param("id") id: number,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.standsService.remove(id, user.id);
  }
}
