import { IoAdapter } from "@nestjs/platform-socket.io";
import * as redisIoAdapter from "socket.io-redis";

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    // @ts-ignore
    const redisAdapter = redisIoAdapter({ host: "foxa.cc", port: 6377 });

    server.adapter(redisAdapter);
    return server;
  }
}
