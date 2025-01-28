import { ApiProperty } from "@nestjs/swagger";

export class BadRequestResponseDto {
  @ApiProperty({ example: 400, description: "HTTP status code" })
  statusCode: number;

  @ApiProperty({
    example: "Profile already exists",
    description: "Error message",
  })
  message: string;
}
class StudentProfileDto {
  @ApiProperty({
    example: "6bc41d85-fc98-4f6d-ac56-332696a6d5bd",
    description: "Unique identifier of the student profile",
  })
  id: string;

  @ApiProperty({
    example: "Ujang",
    description: "Name of the student",
  })
  name: string;

  @ApiProperty({
    example: "Jl. Blablblblbl",
    description: "Address of the student",
  })
  address: string;

  @ApiProperty({
    example: "+628888888888",
    description: "Phone number of the student",
  })
  phone: string;

  @ApiProperty({
    example: "https://example.com/photo.jpg",
    description: "Photo URL of the student (nullable)",
    nullable: true,
  })
  photo: string | null;

  @ApiProperty({
    example: "ecead300-1ecb-4a6a-83c6-373f42a8ab1b",
    description: "User ID associated with the profile",
  })
  userId: string;
}

export class CreateStudentProfileResponseDto {
  @ApiProperty({ example: "success" })
  status: string;

  @ApiProperty({ example: "Profile created successfully" })
  message: string;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({
    example: {
      id: "6bc41d85-fc98-4f6d-ac56-332696a6d5bd",
      name: "Lala",
      address: "Jl. Blablblblbl",
      phone: "+628888888888",
      photo: "https://example.com/photo.jpg",
      userId: "ecead300-1ecb-4a6a-83c6-373f42a8ab1b",
    },
  })
  data: {
    id: string;
    name: string;
    address: string;
    phone: string;
    photo: string | null;
    userId: string;
  };
}

export class GetStudentProfileResponseDto {
  @ApiProperty({ example: "success" })
  status: string;

  @ApiProperty({ example: "Operation successful" })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({
    type: () => StudentProfileDto,
    nullable: true,
  })
  data: StudentProfileDto | null;
}

export class UpdateStudentProfileResponseDto {
  @ApiProperty({ example: "success" })
  status: string;

  @ApiProperty({ example: "Operation successful" })
  message: string;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({
    type: () => StudentProfileDto,
    description: "Updated student profile data",
  })
  data: StudentProfileDto;
}
