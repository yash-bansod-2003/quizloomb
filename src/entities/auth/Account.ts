import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";

@Entity("account")
export class Account {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "text" })
  accountId: string;

  @Column({ type: "text" })
  providerId: string;

  @Column({ type: "text", nullable: true })
  accessToken: string;

  @Column({ type: "text", nullable: true })
  refreshToken: string;

  @Column({ type: "text", nullable: true })
  idToken: string;

  @Column({ type: "timestamp", nullable: true })
  accessTokenExpiresAt: Date;

  @Column({ type: "timestamp", nullable: true })
  refreshTokenExpiresAt: Date;

  @Column({ type: "text", nullable: true })
  scope: string;

  @Column({ type: "text", nullable: true })
  password: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "text", nullable: true })
  userId?: string;
}
