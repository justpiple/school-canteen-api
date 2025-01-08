import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsPositive,
  IsDateString,
  IsOptional,
} from "class-validator";

export class UpdateDiscountDto {
  @ApiProperty({ description: "The name of the discount", required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: "The discount percentage", required: false })
  @IsPositive()
  @IsOptional()
  percentage?: number;

  @ApiProperty({
    description: "The start date of the discount",
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: "The end date of the discount", required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
