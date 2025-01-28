import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

export class UnauthorizedResponse {
  @ApiProperty({
    example: "Username or Password is incorrect",
    description: "Error message",
  })
  message: string;

  @ApiProperty({ example: "Unauthorized", description: "Error type" })
  error: string;

  @ApiProperty({ example: 401, description: "HTTP status code" })
  statusCode: number;
}

export class LoginSuccessResponse {
  @ApiProperty({ example: "success", description: "Status of the operation" })
  status: string;

  @ApiProperty({
    example: "Operation successful",
    description: "Message describing the result",
  })
  message: string;

  @ApiProperty({ example: 200, description: "HTTP status code" })
  statusCode: number;

  @ApiProperty({
    type: "object",
    properties: {
      access_token: {
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "JWT access token",
      },
      id: {
        example: "0165f275-1936-49fe-9c38-a02bd918bb23",
        description: "User ID",
      },
      username: { example: "puji25", description: "Username of the user" },
      role: {
        enum: ["STUDENT", "ADMIN_STAND", "SUPERADMIN"],
        description: "Role of the user",
      },
    },
    description: "Data returned by the API",
  })
  data: {
    access_token: string;
    id: string;
    username: string;
    role: Role;
  };
}

export class BadRequestResponse {
  @ApiProperty({
    example: [
      "password is not strong enough",
      "role must be one of the following values: STUDENT, ADMIN_STAND, SUPERADMIN",
    ],
    description: "Array of error messages",
    type: [String],
  })
  message: string[];

  @ApiProperty({ example: "Bad Request", description: "Error type" })
  error: string;

  @ApiProperty({ example: 400, description: "HTTP status code" })
  statusCode: number;
}

export class SingleBadRequestResponse {
  @ApiProperty({
    example: "password is not strong enough",
    description: "Error message",
  })
  message: string;

  @ApiProperty({ example: "Bad Request", description: "Error type" })
  error: string;

  @ApiProperty({ example: 400, description: "HTTP status code" })
  statusCode: number;
}

export class ForbiddenResponse {
  @ApiProperty({
    example: "User with username puji25 already exists",
    description: "Error message",
  })
  message: string;

  @ApiProperty({ example: "Forbidden", description: "Error type" })
  error: string;

  @ApiProperty({ example: 403, description: "HTTP status code" })
  statusCode: number;
}

export class SignupSuccessResponse {
  @ApiProperty({ example: "success", description: "Status of the operation" })
  status: string;

  @ApiProperty({
    example: "Operation successful",
    description: "Message describing the result",
  })
  message: string;

  @ApiProperty({ example: 201, description: "HTTP status code" })
  statusCode: number;

  @ApiProperty({
    type: "object",
    properties: {
      message: {
        example: "Sign up successfully",
        description: "Success message",
      },
    },
    description: "Data returned by the API",
  })
  data: {
    message: string;
  };
}
