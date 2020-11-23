import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "../channel/channel.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  openid: string;

  @Column()
  session_key: string

  @OneToMany(() => Channel, channel => channel.manager)
  manageChannels: Channel[];

  @ManyToMany(type => Channel)
  @JoinTable()
  subscribeChannels: Channel[];
}