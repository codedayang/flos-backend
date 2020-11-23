import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Repository } from "typeorm";
import { Channel } from "./channel.entity";
import { Cast } from "../cast/cast.entity";
import { BaseRes, Request } from "../app";
import {
  CreateChannelDto, GetAllChannelsReq, GetAllChannelsRes, GetManagedChannelRes,
  GetSubscribedChannelRes,

  SubscribeChannelDto, UnSubscribeChannelDto
} from "./channel.dto";
import { toArray } from "rxjs/operators";
import { WsGateway } from "../ws/ws.gateway";

@Controller("/channel")
@UseGuards(AuthGuard)
export class ChannelController {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    @InjectRepository(Cast) private castRepository: Repository<Cast>,
    private wsGateway: WsGateway
  ) {
  }

  @Post("/create")
  async create(@Req() req: Request): Promise<BaseRes<void>> {
    const dto: CreateChannelDto = req.body;
    const userId = req.userId;

    const channel = this.channelRepository.create();
    const user = await this.userRepository.findOne(userId);

    channel.manager = user;
    channel.title = dto.title;

    await this.channelRepository.save(channel);
    return {
      success: true
    };
  }

  @Post("/subscribe")
  async subscribe(@Req() req: Request): Promise<BaseRes<void>> {
    const dto: SubscribeChannelDto = req.body;
    const userId = req.userId;

    const user = await this.userRepository.findOne(userId, { relations: ["subscribeChannels"] });

    const channel = await this.channelRepository.findOne(dto.channelId);

    // console.log(channel);
    user.subscribeChannels.push(channel);

    this.wsGateway.userIdToSocket[userId].join(channel.id);

    await this.userRepository.save(user);

    return {
      success: true
    };
  }

  @Post("/unsubscribe")
  async unsubscribe(@Req() req: Request): Promise<BaseRes<void>> {
    const dto: UnSubscribeChannelDto = req.body;
    const userId = req.userId;

    const user = await this.userRepository.findOne(userId, { relations: ["subscribeChannels"] });

    const channel = await this.channelRepository.findOne(dto.channelId);

    user.subscribeChannels = user.subscribeChannels.filter((item) => item.id !== dto.channelId);

    await this.userRepository.save(user);

    this.wsGateway.userIdToSocket[userId].leave(channel.id);
    return {
      success: true
    };
  }

  @Get("/managedList")
  async managedList(@Req() req: Request): Promise<BaseRes<GetManagedChannelRes>> {
    const userId = req.userId;
    const user = await this.userRepository.findOne(userId, { relations: ["manageChannels"] });
    return {
      success: true,
      data: {
        manageChannels: user.manageChannels
      }
    };

  }

  @Get("/subscribedList")
  async subscribedList(@Req() req: Request): Promise<BaseRes<GetSubscribedChannelRes>> {
    const userId = req.userId;
    const user = await this.userRepository.findOne(userId, { relations: ["subscribeChannels"] });
    return {
      success: true,
      data: {
        subscribeChannels: user.subscribeChannels
      }
    };

  }

  @Post("/getAll")
  async getAllChannel(@Req() req: Request): Promise<BaseRes<any>> {
    const dto: GetAllChannelsReq = req.body;
    const channels = await this.channelRepository
      .createQueryBuilder("channel")
      .skip(dto.offset)
      .take(dto.size)
      .getMany();

    const userId = req.userId;
    const user = await this.userRepository.findOne(userId, { relations: ["subscribeChannels"] });
    const subscribeChannels = user.subscribeChannels;

    const retChannels = channels.map(item => {
      return {
        ...item,
        isSubscribed: !!subscribeChannels.find(i => i.id === item.id)
      };
    });
    const total = await this.channelRepository.count();
    return {
      success: true,
      data: {
        total: total,
        channels: retChannels
      }
    };
  }


}