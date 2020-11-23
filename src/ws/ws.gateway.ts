import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import SocketIO, { Server, Socket } from "socket.io";
import { AuthService } from "../auth/auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Repository } from "typeorm";
import { Channel } from "../channel/channel.entity";

@WebSocketGateway()
export class WsGateway implements OnGatewayConnection {
  constructor(
    private authService: AuthService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>
  ) {
  }

  userIdToSocket: Map<number, Socket> = new Map<number, Socket>();


  @WebSocketServer()
  server: Server;

  @SubscribeMessage("message")
  handleMessage(socket: Socket, payload: any): string {
    console.log(payload);
    socket.emit("ack", "OK");
    socket.join("1");
    return "Hello Aworld!";
  }

  async handleConnection(socket: any, ...args: any[]): Promise<any> {
    const token = socket.handshake.query.token;

    const userId = await this.authService.checkPermission(token);
    if (userId == -1) return new Error("No permit");
    console.log("Connection OK userId: " + userId);
    this.userIdToSocket[userId] = socket;

    const user = await this.userRepository.findOne(userId, { relations: ["subscribeChannels"] });
    const subscribeChannels= user.subscribeChannels
    subscribeChannels.forEach(channel => {
      socket.join(channel.id)
    })
    return "OK";
  }
}
