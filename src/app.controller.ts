import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  VERSION_NEUTRAL,
} from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";

@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  @HttpCode(HttpStatus.OK)
  @Get("/status")
  @ApiExcludeEndpoint()
  async root() {
    return {
      message: "API for School Canteen running properly",
      version: "1.0",
    };
  }
}
