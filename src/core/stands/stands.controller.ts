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
import { UseAuth } from "../auth/auth.decorator";
import { AuthGuard } from "../auth/auth.guard";
import { UserWithoutPasswordType } from "../users/users.types";
import { PrismaService } from "src/lib/prisma/prisma.service";
import { Roles } from "../auth/roles.decorator";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Stands")
@Controller("stands")
@UseGuards(AuthGuard)
export class StandsController {
  constructor(
    private readonly standsService: StandsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @Roles("ADMIN_STAND")
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

  @Get()
  @ApiOperation({
    summary: "Get all stands",
    description: "Retrieves all stands from the database.",
  })
  async findAll() {
    return this.standsService.findAll();
  }

  @Get("me")
  @Roles("ADMIN_STAND")
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
  async findOne(@Param("id") id: number) {
    return this.standsService.findOne(id);
  }

  @Patch(":id")
  @Roles("SUPERADMIN")
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
  @Roles("SUPERADMIN")
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

  @Patch("me")
  @Roles("ADMIN_STAND")
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
}
