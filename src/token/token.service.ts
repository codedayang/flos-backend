import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService
  ) {
    console.log("cons");
  }

  sign(payload: any): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): { [key: string]: string } {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      return undefined;
    }
  }


}
