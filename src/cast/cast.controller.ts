import { Controller, Get, HttpService, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CreateCastReq, GetSubscribedCastReq, GetSubscribedCastRes } from "./cast.dto";
import { BaseRes, Request } from "../app";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { getConnection, Repository } from "typeorm";
import { RedisService } from "nestjs-redis";
import { TokenService } from "../token/token.service";
import { Channel } from "../channel/channel.entity";
import { Cast } from "./cast.entity";
import moment from "moment-es6";
import { WsGateway } from "../ws/ws.gateway";

@Controller("cast")
@UseGuards(AuthGuard)
export class CastController {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Cast) private castRepository: Repository<Cast>,
    private wsGateWay: WsGateway
  ) {
  }

  //分页从第0页开始
  @Post("/getSubscribed")
  async getSubscribed(@Req() req: Request): Promise<BaseRes<GetSubscribedCastRes>> {
    const dto: GetSubscribedCastReq = req.body;
    const userId = req.userId;

    const user = await this.userRepository.findOne(userId, { relations: ["subscribeChannels"] });
    const subscribeChannels = user.subscribeChannels;
    const subscribeIds = subscribeChannels.map(item => item.id);

    // console.log(subscribeChannels);

    const cast = await this.castRepository.createQueryBuilder("cast")
      .leftJoinAndSelect("cast.channel", "channel")
      .where("cast.channel.id IN (:...ids)", { ids: subscribeIds })
      .skip(dto.offset)
      .take(dto.size)
      .orderBy("cast.updatedAt", "DESC")
      .getMany();

    const total = await this.castRepository.count();


    return {
      success: true,
      data: {
        total: total,
        casts: cast
      }
    };
  }

  @Post("/create")
  async create(@Req() req: Request): Promise<BaseRes<void>> {
    const dto: CreateCastReq = req.body;
    const userId = req.userId;

    const user = await this.userRepository.findOne(userId, { relations: ["manageChannels"] });
    const channel = await this.channelRepository.findOne(dto.channelId);

    console.log(user);
    if (!user.manageChannels.find((item) => item.id === channel.id)) {
      return { success: false };
    }

    const cast = this.castRepository.create();
    cast.content = dto.content;
    cast.channel = channel;
    cast.updatedAt = moment().unix();

    await this.castRepository.save(cast);

    //TODO: Websocket通知Channel

    this.wsGateWay.server.to(channel.id.toString()).emit("updated", cast);

    return {
      success: true
    };
  }
}
