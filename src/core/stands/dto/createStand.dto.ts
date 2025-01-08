import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsPhoneNumber } from "class-validator";

export class CreateStandDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  standName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ownerName: string;

  @ApiProperty()
  @IsPhoneNumber(null, { message: "Invalid phone number." })
  phone: string;
}
