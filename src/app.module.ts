import { Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { AuthModule } from "./core/auth/auth.module";
import { UsersModule } from "./core/users/users.module";
import { StandsModule } from "./core/stands/stands.module";
import { DiscountsModule } from "./core/discounts/discounts.module";
import { MenuModule } from "./core/menu/menu.module";
import { StudentModule } from "./core/students/students.module";
import { OrderModule } from "./core/orders/orders.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    AuthModule,
    UsersModule,
    StandsModule,
    DiscountsModule,
    MenuModule,
    StudentModule,
    OrderModule,
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
