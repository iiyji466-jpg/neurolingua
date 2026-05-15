import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ["error", "warn", "log"] });
  const config = app.get(ConfigService);

  // ── Security ────────────────────────────────────────────
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // ── CORS ────────────────────────────────────────────────
  app.enableCors({
    origin: [
      config.get("APP_URL") || "http://localhost:3000",
      "https://neurolingua.ai",
      "https://www.neurolingua.ai",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // ── Validation ──────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Swagger (dev only) ──────────────────────────────────
  if (config.get("NODE_ENV") !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("NeuroLingua AI API")
      .setDescription("Production-grade AI language learning platform")
      .setVersion("1.0")
      .addBearerAuth()
      .addCookieAuth("access_token")
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/docs", app, document);
    console.log(`📚 Swagger: http://localhost:${config.get("PORT") || 4000}/api/docs`);
  }

  // ── Listen ──────────────────────────────────────────────
  const port = config.get<number>("PORT") || 4000;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
}

bootstrap();
