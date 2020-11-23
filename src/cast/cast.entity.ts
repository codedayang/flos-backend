import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "../channel/channel.entity";

@Entity()
export class Cast {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  updatedAt: number;

  @ManyToOne(type => Channel, channel => channel.casts)
  channel: Channel;

}