import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  username?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiPropertyOptional()
  role?: Role;
}
