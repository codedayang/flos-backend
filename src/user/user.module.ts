import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Channel } from "../channel/channel.entity";
import { TokenModule } from "../token/token.module";
import { AuthModule } from "../auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { Cast } from "../cast/cast.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Channel, Cast]),
    TokenModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET + "",
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
