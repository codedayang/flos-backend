import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Repository } from "typeorm";
import { Channel } from "../channel/channel.entity";
import { TokenService } from "../token/token.service";
import { RedisService } from "nestjs-redis";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private redisService: RedisService,
    private tokenService: TokenService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const {token} = request.headers;
    // console.log(token);
    if (token === undefined) return false;
    const user = this.tokenService.verify(token)
    // console.log(user);
    if (user === undefined) return false;
    if (await this.redisService.getClient().exists(user.id) === 0) return false;
    if (await this.redisService.getClient().get(user.id) !== token) return false;

    await this.redisService.getClient().set(user.id, token, 'EX', 60*30)
    request.userId = user.id;
    return true;
  }

}