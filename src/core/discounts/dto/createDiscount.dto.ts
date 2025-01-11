import {
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
  IsOptional,
  IsArray,
  IsNotEmpty,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateDiscountDto {
  @ApiProperty({
    description: "The name of the discount.",
    example: "Summer Sale",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "The percentage of the discount, between 0 and 100.",
    example: 25,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiProperty({
    description: "The start date of the discount.",
    example: "2025-06-01T00:00:00Z",
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: "The end date of the discount.",
    example: "2025-06-30T23:59:59Z",
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({
    description:
      "The ID of the stand this discount is associated with. Only required if creating a discount by SUPERADMIN.",
    example: 123,
  })
  @IsNumber()
  @IsOptional()
  standId?: number;

  @ApiProperty({ description: "Menu discounted", required: false })
  @IsOptional()
  @IsArray()
  menus?: number[];
}
