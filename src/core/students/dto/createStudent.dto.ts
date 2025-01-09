import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsPhoneNumber } from "class-validator";

export class CreateStudentDto {
  @ApiProperty({ description: "Name of the student" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Address of the student" })
  @IsString()
  address: string;

  @ApiProperty({ description: "Phone number of the student" })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: "Photo of the student (optional)",
    required: false,
    type: "string",
    format: "binary",
  })
  @IsOptional()
  photo?: string;

  @ApiProperty({
    description: "User ID of Student, required if (Superadmin)",
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
