import { Controller, Get, Logger, Post, Req, UseGuards } from "@nestjs/common";
import { WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { WsGateway } from "./ws.gateway";
import { AuthGuard } from "../auth/auth.guard";

@Controller("ws")
export class WsController {
  constructor(
    private readonly wsGateway: WsGateway,
  ) {
  }

  private readonly logger = new Logger(WsController.name);

  @Post()

  @Get("/1")
  find() {
    this.wsGateway.server.to("1").emit("FOO", "FOOACK");
    this.logger.log("GET /ws/1")
    return "1";
  }
  @Get("/2")
  find2() {
    return "2";
  }
}
