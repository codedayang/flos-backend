import { Module } from "@nestjs/common";
import { CastModule } from "./cast/cast.module";
import { UserModule } from "./user/user.module";
import { WsModule } from "./ws/ws.module";
import { WsGateway } from "./ws/ws.gateway";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "nestjs-redis";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user/user.entity";
import { Channel } from "./channel/channel.entity";
import { Cast } from "./cast/cast.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthGuard } from "./auth/auth.guard";
import { ChannelModule } from "./channel/channel.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.register({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      db: parseInt(process.env.REDIS_DB),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_PRIFIX
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: [User, Channel, Cast],
      synchronize: true
    }),
    AuthModule, CastModule, ChannelModule, UserModule, WsModule],
  controllers: [],
  providers: []
})
export class AppModule {
}
