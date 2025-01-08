import { Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./core/auth/auth.module";
import { UsersModule } from "./core/users/users.module";
import { StandsModule } from "./core/stands/stands.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    StandsModule,
    ConfigModule.forRoot({ envFilePath: ".env" }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
