import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  VERSION_NEUTRAL,
} from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { AllowAnon } from "./core/auth/auth.decorator";

@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  @HttpCode(HttpStatus.OK)
  @Get("/")
  @ApiExcludeEndpoint()
  @AllowAnon()
  async root() {
    return {
      message: "API for School Canteen running properly",
      version: "1.0",
    };
  }
}
