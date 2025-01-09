import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsPhoneNumber } from "class-validator";

export class UpdateStudentDto {
  @ApiProperty({ description: "Name of the student", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: "Address of the student", required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: "Phone number of the student", required: false })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    description: "Photo of the student (optional)",
    required: false,
    type: "string",
    format: "binary",
  })
  @IsOptional()
  photo?: string;

  @ApiProperty({
    description: "User ID of Student (Superadmin)",
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
