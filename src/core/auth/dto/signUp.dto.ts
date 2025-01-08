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
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(Role)
  role: Role;
}

export default SignUpDto;
