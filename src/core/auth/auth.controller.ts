import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AllowAnon } from "./auth.decorator";
import { AuthService } from "./auth.service";
import SignInDto from "./dto/signIn.dto";
import SignUpDto from "./dto/signUp.dto";
import {
  BadRequestResponse,
  ForbiddenResponse,
  LoginSuccessResponse,
  SignupSuccessResponse,
  SingleBadRequestResponse,
  UnauthorizedResponse,
} from "./dto/response.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnon()
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  @ApiOperation({ summary: "User Sign In", tags: ["auth"] })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: UnauthorizedResponse,
  })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    type: LoginSuccessResponse,
  })
  signIn(@Body() credentials: SignInDto) {
    return this.authService.signIn(credentials.username, credentials.password);
  }

  @AllowAnon()
  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  @ApiOperation({ summary: "User Sign Up", tags: ["auth"] })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Validation failed",
    type: BadRequestResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Single validation error",
    type: SingleBadRequestResponse,
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
    type: ForbiddenResponse,
  })
  @ApiResponse({
    status: 201,
    description: "Signup successful",
    type: SignupSuccessResponse,
  })
  async signUp(@Body() credentials: SignUpDto) {
    await this.authService.signUp(
      credentials.username,
      credentials.password,
      credentials.role,
    );

    return { message: "Sign up successfully" };
  }
}
