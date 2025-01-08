import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  UseGuards,
  Patch,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MenuService } from "./menu.service";
import { CreateMenuDto } from "./dto/createMenu.dto";
import { UpdateMenuDto } from "./dto/updateMenu.dto";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../auth/roles.decorator";
import { AllowAnon, UseAuth } from "../auth/auth.decorator";
import { UserWithoutPasswordType } from "../users/users.types";
import { Role } from "@prisma/client";

@ApiTags("Menu")
@Controller("menu")
@UseGuards(AuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN_STAND)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a new menu",
    description:
      "SUPERADMIN can create menus for any stand. ADMIN_STAND can only create menus for their own stand.",
  })
  async create(
    @Body() createMenuDto: CreateMenuDto,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.menuService.create(createMenuDto, user.id);
  }

  @Get("stand/:standId")
  @ApiOperation({
    summary: "Get all menus for a specific stand",
    description: "Fetch all menus belonging to a specific stand.",
  })
  @AllowAnon()
  async findAll(@Param("standId", ParseIntPipe) standId: number) {
    return this.menuService.findAll(standId);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a menu by ID",
    description:
      "Fetch a specific menu by its ID, including active discounts if any.",
  })
  @AllowAnon()
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.SUPERADMIN, Role.ADMIN_STAND)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a menu",
    description:
      "SUPERADMIN can update any menu. ADMIN_STAND can only update menus for their own stand.",
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.menuService.update(id, updateMenuDto, user.id);
  }

  @Delete(":id")
  @Roles(Role.SUPERADMIN, Role.ADMIN_STAND)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a menu",
    description:
      "SUPERADMIN can delete any menu. ADMIN_STAND can only delete menus for their own stand.",
  })
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.menuService.remove(id, user.id);
  }
}
