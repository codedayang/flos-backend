import { Controller, Get, HttpService, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { RedisService } from "nestjs-redis";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Repository } from "typeorm";
import { TokenService } from "../token/token.service";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {
  private readonly appId = "wxe48a3d699f7d6cfa";
  private readonly appSecret = "77020f7c6eb161a2f847a5fe499e477b";
  private readonly wxHost = "https://api.weixin.qq.com/sns/jscode2session";

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private httpService: HttpService,
    private redisService: RedisService,
    private tokenService: TokenService

  ) {
  }
  @Post("/login")
  async login(@Req() req: Request): Promise<any> {
    console.log(req.body);
    const { code } = req.body;
    const res = await this.httpService.get(this.wxHost, {
      params: {
        appid: this.appId,
        secret: this.appSecret,
        js_code: code,
        grant_type: "authorization_code"
      }
    }).toPromise()

    console.log(res.data);
    let user = await this.userRepository.findOne({
      openid: res.data.openid
    })
    if (user === undefined) {
      const fresh = this.userRepository.create();
      fresh.openid = res.data.openid;
      fresh.session_key = res.data.session_key
      user = await this.userRepository.save(fresh);
    }

    const token = this.tokenService.sign({id: user.id});
    const redisKey = user.id.toString();
    await this.redisService.getClient().set(redisKey, token, 'EX', 60*30);

    return {
      token: token
    };
  }

  @Get("/verify")
  @UseGuards(AuthGuard)
  async verify(@Req() req: Request): Promise<boolean> {
    return true;
  }
}
