import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class UserDataDto {
  @ApiProperty({
    example: "0165f275-1936-49fe-9c38-a02bd918bb23",
    description: "ID of the user",
  })
  id: string;

  @ApiProperty({ example: "puji2555", description: "Username of the user" })
  username: string;

  @ApiProperty({
    example: "STUDENT",
    description: "Role of the user",
    enum: Role,
  })
  role: Role;
}

export class UpdateUserResponseDto {
  @ApiProperty({ example: "success", description: "Status of the operation" })
  status: string;

  @ApiProperty({
    example: "Operation successful",
    description: "Message describing the result of the operation",
  })
  message: string;

  @ApiProperty({ example: 200, description: "HTTP status code" })
  statusCode: number;

  @ApiProperty({ type: UserDataDto, description: "Updated user data" })
  data: UserDataDto;
}

export class GetCurrentUserResponseDto {
  @ApiProperty({ example: "success", description: "Status of the operation" })
  status: string;

  @ApiProperty({
    example: "Operation successful",
    description: "Message describing the result of the operation",
  })
  message: string;

  @ApiProperty({ example: 200, description: "HTTP status code" })
  statusCode: number;

  @ApiProperty({
    type: UserDataDto,
    description: "Current logged-in user data",
  })
  data: UserDataDto;
}
