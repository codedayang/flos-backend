import { HttpService, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Repository } from "typeorm";
import { RedisService } from "nestjs-redis";
import { TokenService } from "../token/token.service";

@Injectable()
export class AuthService {
  constructor(
    private redisService: RedisService,
    private tokenService: TokenService
  ) {
  }

  async checkPermission(token: string): Promise<number> {
    // console.log(token);
    if (token === "") return -1;
    const user = this.tokenService.verify(token)
    // console.log(user);
    if (user === undefined) return -1;
    if (await this.redisService.getClient().exists(user.id) === 0) return -1;
    if (await this.redisService.getClient().get(user.id) !== token) return -1;

    await this.redisService.getClient().set(user.id, token, 'EX', 60*30)
    return parseInt(user.id);

  }
}
