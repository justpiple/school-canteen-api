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
  ForbiddenException,
  ParseIntPipe,
} from "@nestjs/common";
import { DiscountsService } from "./discounts.service";
import { CreateDiscountDto } from "./dto/createDiscount.dto";
import { UpdateDiscountDto } from "./dto/updateDiscount.dto";
import { UseAuth } from "../auth/auth.decorator";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../auth/roles.decorator";
import { UserWithoutPasswordType } from "../users/users.types";
import { PrismaService } from "src/lib/prisma/prisma.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { ApiGlobalResponses } from "src/common/dto/global-response.dto";

@ApiTags("Discounts")
@Controller("discounts")
@UseGuards(AuthGuard)
@ApiGlobalResponses()
export class DiscountsController {
  constructor(
    private readonly discountsService: DiscountsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN_STAND)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a new discount",
    description:
      "SUPERADMIN can create a discount for any stand. ADMIN_STAND can create a discount only for their own stand.",
  })
  async create(
    @Body() createDiscountDto: CreateDiscountDto,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    if (user.role !== Role.SUPERADMIN) {
      const userStand = await this.prisma.stand.findUnique({
        where: { ownerId: user.id },
      });

      if (!userStand) {
        throw new NotFoundException("You do not own a stand.");
      }

      createDiscountDto.standId = userStand.id;
    }

    return this.discountsService.create(createDiscountDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all discounts",
    description:
      "SUPERADMIN can see all discounts. ADMIN_STAND can see discounts for their own stand.",
  })
  async findAll(@UseAuth() user: UserWithoutPasswordType) {
    const isSuperAdmin = user.role === Role.SUPERADMIN;
    if (isSuperAdmin) {
      return this.discountsService.findAll();
    } else {
      return this.discountsService.findByStand(user.id);
    }
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get discount by ID",
    description: "Fetch a specific discount by its ID.",
  })
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    const discount = await this.discountsService.findOne(id);

    if (!discount) {
      throw new NotFoundException(`Discount with ID '${id}' not found.`);
    }

    const userStand = await this.prisma.stand.findUnique({
      where: { ownerId: user.id },
    });

    if (user.role !== Role.SUPERADMIN && discount.standId !== userStand?.id) {
      throw new ForbiddenException("You do not have access to this discount.");
    }

    return discount;
  }

  @Patch(":id")
  @Roles(Role.SUPERADMIN, Role.ADMIN_STAND)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a discount",
    description:
      "SUPERADMIN can update any discount. ADMIN_STAND can only update their own stand's discount.",
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDiscountDto: UpdateDiscountDto,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    const discount = await this.discountsService.findOne(id);

    if (!discount) {
      throw new NotFoundException(`Discount with ID '${id}' not found.`);
    }

    const userStand = await this.prisma.stand.findUnique({
      where: { ownerId: user.id },
    });

    if (user.role !== Role.SUPERADMIN && discount.standId !== userStand?.id) {
      throw new ForbiddenException(
        "You do not have access to update this discount.",
      );
    }

    return this.discountsService.update(id, updateDiscountDto);
  }

  @Delete(":id")
  @Roles(Role.SUPERADMIN, Role.ADMIN_STAND)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a discount",
    description:
      "SUPERADMIN can delete any discount. ADMIN_STAND can only delete their own stand's discount.",
  })
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    const discount = await this.discountsService.findOne(id);

    if (!discount) {
      throw new NotFoundException(`Discount with ID '${id}' not found.`);
    }

    const userStand = await this.prisma.stand.findUnique({
      where: { ownerId: user.id },
    });

    if (user.role !== Role.SUPERADMIN && discount.standId !== userStand?.id) {
      throw new ForbiddenException(
        "You do not have access to delete this discount.",
      );
    }

    return this.discountsService.remove(id);
  }
}
