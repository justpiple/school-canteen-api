import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { LogLevel, ValidationPipe, VersioningType } from "@nestjs/common";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./common/response.interceptor";

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === "production";
  const logLevels: LogLevel[] = isProduction
    ? ["error", "warn", "log"]
    : ["error", "warn", "log", "verbose", "debug"];

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const documentConfig = new DocumentBuilder()
    .setTitle("School Canteen")
    .setDescription("School Canteen Ordering System")
    .setVersion("1.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "JWT",
      description: "Enter JWT token",
      in: "header",
    })
    .addServer("http://localhost:3000", "development local")
    .addServer("https://canteen-api.benspace.xyz", "testing server")
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup("/docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(3000);
}

bootstrap();
