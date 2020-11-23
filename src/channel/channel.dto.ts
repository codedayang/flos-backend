import { Channel } from "./channel.entity";

export class CreateChannelDto {
  title: string;
}

export class SubscribeChannelDto {
  channelId: number;
}

export class UnSubscribeChannelDto {
  channelId: number;
}


export class GetManagedChannelRes {
  manageChannels: Channel[];
}

export class GetSubscribedChannelRes {
  subscribeChannels: Channel[];
}

export class GetAllChannelsReq {
  offset: number;
  size: number;
}

export class GetAllChannelsRes {
  total: number;
  channels: Channel[]
}