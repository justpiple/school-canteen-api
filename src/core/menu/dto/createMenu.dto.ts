import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, IsEnum } from "class-validator";
import { MenuType } from "@prisma/client";

export class CreateMenuDto {
  @ApiProperty({ description: "Name of the menu item" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Description of the menu item", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Price of the menu item" })
  @IsNumber()
  price: number;

  @ApiProperty({ description: "Type of menu item (Food or Drink)" })
  @IsEnum(MenuType)
  type: MenuType;

  @ApiProperty({ description: "Photo URL for the menu item", required: false })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({
    description: "ID of the stand this menu belongs to",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  standId?: number;
}
