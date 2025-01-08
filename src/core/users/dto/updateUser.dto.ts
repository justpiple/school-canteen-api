import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiPropertyOptional()
  role?: Role;
}
