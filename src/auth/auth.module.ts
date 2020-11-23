import { HttpModule, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Channel } from "../channel/channel.entity";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { TokenModule } from "../token/token.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TokenModule,
    HttpModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]


})
export class AuthModule {
}
