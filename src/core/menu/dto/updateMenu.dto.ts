import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsEnum, IsInt } from "class-validator";
import { MenuType } from "@prisma/client";
import { Type } from "class-transformer";

export class UpdateMenuDto {
  @ApiProperty({ description: "Name of the menu item", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: "Description of the menu item", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Price of the menu item", required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  price?: number;

  @ApiProperty({
    description: "Type of menu item (Food or Drink)",
    required: false,
    enum: MenuType,
  })
  @IsOptional()
  @IsEnum(MenuType)
  type?: MenuType;

  @ApiProperty({
    description: "Photo File for the menu item",
    required: false,
    format: "binary",
    type: "string",
  })
  @IsOptional()
  photo?: string;
}
