import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WsAdapter } from "@nestjs/platform-ws";
import { RedisIoAdapter } from "./ws/RedisIoAdapter";
import dotenv from "dotenv"
import * as fs from "fs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH)
    }
  });
  app.enableCors({ origin: true, credentials: true });
  // app.useWebSocketAdapter(new RedisIoAdapter(app));
  await app.listen(3000);
}

bootstrap();
