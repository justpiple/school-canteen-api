import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsPhoneNumber } from "class-validator";

export class UpdateStandDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  standName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  ownerName?: string;

  @IsOptional()
  @IsPhoneNumber(null, { message: "Invalid phone number." })
  @ApiPropertyOptional()
  phone?: string;
}
