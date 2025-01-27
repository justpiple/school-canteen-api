import { ApiProperty } from "@nestjs/swagger";

export class StandDto {
  @ApiProperty({
    example: 148,
    description: "The unique identifier of the stand",
  })
  id: number;

  @ApiProperty({
    example: "Warung Berkah",
    description: "The name of the stand",
  })
  standName: string;

  @ApiProperty({
    example: "Maharani Juli",
    description: "The name of the stand owner",
  })
  ownerName: string;

  @ApiProperty({
    example: "+6299032874235",
    description: "The phone number of the stand owner",
  })
  phone: string;

  @ApiProperty({
    example: "4085ea7d-9afd-4afc-8557-41a5a8c9f788",
    description: "The unique identifier of the stand owner",
  })
  ownerId: string;

  @ApiProperty({
    example: "2024-10-15T03:31:42.810Z",
    description: "The timestamp when the stand was created",
  })
  createdAt: string;

  @ApiProperty({
    example: "2025-01-17T16:49:22.190Z",
    description: "The timestamp when the stand was last updated",
  })
  updatedAt: string;
}

export class GetStandsResponseDto {
  @ApiProperty({
    example: "success",
    description: "The status of the response",
  })
  status: string;

  @ApiProperty({
    example: "Operation successful",
    description: "The message of the response",
  })
  message: string;

  @ApiProperty({
    example: 200,
    description: "The status code of the response",
  })
  statusCode: number;

  @ApiProperty({
    type: [StandDto],
    description: "The list of stands",
  })
  data: StandDto[];
}

export class CreateStandProfileResponseDto {
  @ApiProperty({ example: "success" })
  status: string;

  @ApiProperty({ example: "Profile created successfully" })
  message: string;

  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({
    example: {
      id: "6bc41d85-fc98-4f6d-ac56-332696a6d5bd",
      ownerName: "Pak Yoyok",
      standName: "Yoyok's Canteen",
      ownerId: "ecead300-1ecb-4a6a-83c6-373f42a8ab1b",
    },
  })
  data: {
    id: string;
    ownerName: string;
    standName: string;
    ownerId: string;
  };
}
