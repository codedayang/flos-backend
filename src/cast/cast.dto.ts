import { Cast } from "./cast.entity";

export class CreateCastReq {
  content: string;
  channelId: number;
}

export class GetSubscribedCastReq {
  offset: number;
  size: number;
}

export class GetSubscribedCastRes {
  total: number;
  casts: Cast[]
}