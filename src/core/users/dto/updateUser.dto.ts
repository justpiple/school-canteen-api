import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: "The new username for the user.",
    example: "new_username",
  })
  username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: "The new password for the user.",
    example: "new_password123",
  })
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiPropertyOptional({
    description: "The new role for the user.",
    enum: Role,
    example: Role.STUDENT,
  })
  role?: Role;
}
