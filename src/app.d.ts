
import { Request as OriRequest } from "express";

export type Request = OriRequest & { userId: string;}

export class BaseRes<T> {
  success: boolean;
  data?: T;
}
