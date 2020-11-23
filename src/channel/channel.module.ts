import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Channel } from "./channel.entity";
import { Cast } from "../cast/cast.entity";
import { TokenModule } from "../token/token.module";
import { ChannelController } from "./channel.controller";
import { WsModule } from "../ws/ws.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Channel, Cast]),
    TokenModule,
    WsModule
  ],
  controllers: [ChannelController],
  providers: []
})
export class ChannelModule{}