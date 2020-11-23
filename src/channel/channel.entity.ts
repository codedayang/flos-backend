import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cast } from "../cast/cast.entity";
import { User } from "../user/user.entity";

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(type => Cast, cast => cast.channel)
  @JoinTable()
  casts: Cast[];

  @ManyToOne(() => User, user => user.manageChannels)
  manager: User;
}