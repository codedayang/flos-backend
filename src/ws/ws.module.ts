import { Logger, Module } from "@nestjs/common";
import { WsGateway } from "./ws.gateway";
import { WsController } from "./ws.controller";
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "../auth/auth.service";
import { TokenModule } from "../token/token.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Channel } from "../channel/channel.entity";
import { Cast } from "../cast/cast.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Channel, Cast]),AuthModule, TokenModule],
  controllers: [WsController],
  providers: [WsGateway],
  exports: [WsGateway]
})
export class WsModule {}
