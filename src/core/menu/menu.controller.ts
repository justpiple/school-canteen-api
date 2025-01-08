import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MenuService } from "./menu.service";
import { CreateMenuDto } from "./dto/createMenu.dto";
import { UpdateMenuDto } from "./dto/updateMenu.dto";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../auth/roles.decorator";
import { UseAuth } from "../auth/auth.decorator";
import { UserWithoutPasswordType } from "../users/users.types";

@ApiTags("Menus")
@Controller("menus")
@UseGuards(AuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles("SUPERADMIN", "ADMIN_STAND")
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
  async findAll(@Param("standId") standId: number) {
    return this.menuService.findAll(standId);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a menu by ID",
    description:
      "Fetch a specific menu by its ID, including active discounts if any.",
  })
  async findOne(
    @Param("id") id: number,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.menuService.findOne(id, user.id);
  }

  @Patch(":id")
  @Roles("SUPERADMIN", "ADMIN_STAND")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a menu",
    description:
      "SUPERADMIN can update any menu. ADMIN_STAND can only update menus for their own stand.",
  })
  async update(
    @Param("id") id: number,
    @Body() updateMenuDto: UpdateMenuDto,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.menuService.update(id, updateMenuDto, user.id);
  }

  @Delete(":id")
  @Roles("SUPERADMIN", "ADMIN_STAND")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a menu",
    description:
      "SUPERADMIN can delete any menu. ADMIN_STAND can only delete menus for their own stand.",
  })
  async remove(
    @Param("id") id: number,
    @UseAuth() user: UserWithoutPasswordType,
  ) {
    return this.menuService.remove(id, user.id);
  }
}
