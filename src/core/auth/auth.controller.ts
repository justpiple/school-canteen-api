import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AllowAnon } from "./auth.decorator";
import { AuthService } from "./auth.service";
import SignInDto from "./dto/signIn.dto";
import SignUpDto from "./dto/signUp.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnon()
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  @ApiOperation({ summary: "User Sign In", tags: ["auth"] })
  signIn(@Body() credentials: SignInDto) {
    return this.authService.signIn(credentials.username, credentials.password);
  }

  @AllowAnon()
  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  @ApiOperation({ summary: "User Sign Up", tags: ["auth"] })
  async signUp(@Body() credentials: SignUpDto) {
    await this.authService.signUp(
      credentials.username,
      credentials.password,
      credentials.role,
    );

    return { message: "Sign up successfully" };
  }
}
