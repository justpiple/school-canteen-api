import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ResponseTemplate } from "../../utils/interceptors/transform.interceptor";
import { AllowAnon } from "./auth.decorator";
import { AuthService } from "./auth.service";
import SignInDto from "./dto/signIn.dto";
import SignUpDto from "./dto/signUp.dto";
import { UserWithoutPasswordType } from "../users/users.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnon()
  @HttpCode(HttpStatus.OK)
  @Post("signin")
  @ApiOperation({ summary: "User Sign In", tags: ["auth"] })
  async signIn(
    @Body() credentials: SignInDto,
  ): Promise<
    ResponseTemplate<UserWithoutPasswordType & { access_token: string }>
  > {
    return {
      message: "Sign in successfully",
      result: await this.authService.signIn(
        credentials.username,
        credentials.password,
      ),
    };
  }

  @AllowAnon()
  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  @ApiOperation({ summary: "User Sign Up", tags: ["auth"] })
  async signUp(
    @Body() credentials: SignUpDto,
  ): Promise<ResponseTemplate<null>> {
    await this.authService.signUp(
      credentials.username,
      credentials.password,
      credentials.role,
    );

    return { message: "Sign up successfully", result: null };
  }
}
