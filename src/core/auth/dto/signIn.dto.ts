import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "User's username" })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "User's password " })
  password: string;
}

export default SignInDto;
