import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { Channel } from "../channel/channel.entity";
import { TokenService } from "../token/token.service";
import { v4 as uuidv4 } from "uuid";
import { AuthGuard } from "../auth/auth.guard";
import { Request } from "express";
import { Cast } from "../cast/cast.entity";
interface UserResponse<T = unknown> {
  isSuccess: boolean;
  data?: T;
  msg: string;
}

@Controller("user")
// @UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Cast) private castRepository: Repository<Cast>,
    private readonly tokenService: TokenService
  ) {
  }

  @Get("/users")
  async getAll(): Promise<UserResponse<string>> {
    return {
      isSuccess: true,
      data: "123",
      msg: "",
    };
  }

  @Get("/1")
  find(): string {
    return "1";
  }
  @Get("/foff")
  async foff(@Req() req: Request & {foff:string}): Promise<string> {
    return req.foff;
  }

  @Get("/test")
  async test(): Promise<string> {
    const user = this.userRepository.create();
    console.log(user);
    user.openid = "gg";
    user.subscribeChannels = [];
    user.session_key = "kk";
    await this.userRepository.save(user);

    // const tar = await this.userRepository.findOne({
    //   where: {
    //     openid: "gg"
    //   }
    // });
    const tar = user;

    console.log(tar);

    const channel = this.channelRepository.create();
    channel.title = "foo";
    await this.channelRepository.save(channel);
    tar.subscribeChannels = [channel];

    const cast = this.castRepository.create();
    cast.content = "castContent";
    cast.updatedAt = 111;
    await this.castRepository.save(cast);

    channel.casts = [cast];

    await this.channelRepository.save(channel);

    await this.userRepository.save(tar);

    console.log(JSON.stringify(tar));

    return "OK";
  }
}
