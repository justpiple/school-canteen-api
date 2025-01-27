import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "user123" })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "StrongPassword123!",
    description: "Password of the user",
  })
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(Role)
  @ApiProperty({
    example: "STUDENT",
    description: "Role of the user",
    enum: ["STUDENT", "ADMIN_STAND", "SUPERADMIN"],
  })
  role: Role;
}

export default SignUpDto;
