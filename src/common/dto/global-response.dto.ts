import { applyDecorators } from "@nestjs/common";
import { ApiProperty, ApiResponse } from "@nestjs/swagger";

class UnauthorizedResponse {
  @ApiProperty({ example: "User not authorized", description: "Error message" })
  message: string;

  @ApiProperty({ example: "Unauthorized", description: "Error type" })
  error: string;

  @ApiProperty({ example: 401, description: "HTTP status code" })
  statusCode: number;
}

export class ForbiddenResponse {
  @ApiProperty({
    example: "You do not have permission to access this resource",
    description: "Error message",
  })
  message: string;

  @ApiProperty({ example: "Forbidden", description: "Error type" })
  error: string;

  @ApiProperty({ example: 403, description: "HTTP status code" })
  statusCode: number;
}

class ServerErrorResponse {
  @ApiProperty({
    example: "Internal Server Error",
    description: "Error message",
  })
  message: string;

  @ApiProperty({ example: 500, description: "HTTP status code" })
  statusCode: number;
}

export function ApiGlobalResponses() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: "Unauthorized",
      type: UnauthorizedResponse,
    }),
    ApiResponse({
      status: 500,
      description: "Internal Server Error",
      type: ServerErrorResponse,
    }),
    ApiResponse({
      status: 403,
      description: "Forbidden",
      type: ForbiddenResponse,
    }),
  );
}
