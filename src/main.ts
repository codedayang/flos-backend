import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WsAdapter } from "@nestjs/platform-ws";
import { RedisIoAdapter } from "./ws/RedisIoAdapter";
import dotenv from "dotenv"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  // app.useWebSocketAdapter(new RedisIoAdapter(app));
  await app.listen(3000);
}

bootstrap();
