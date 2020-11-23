import { Module } from "@nestjs/common";
import { CastController } from "./cast.controller";
import { CastService } from "./cast.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { TokenModule } from "../token/token.module";
import { Cast } from "./cast.entity";
import { Channel } from "../channel/channel.entity";
import { WsModule } from "../ws/ws.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Channel, Cast]),
    TokenModule,
    WsModule

  ],
  controllers: [CastController],
  providers: [CastService]
})
export class CastModule {
}
