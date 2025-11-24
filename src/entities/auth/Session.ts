import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./User.js";

@Entity("session")
export class Session {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @Column({ type: "text" })
  @Index({ unique: true })
  token: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Column({ type: "text", nullable: true })
  ipAddress: string;

  @Column({ type: "text", nullable: true })
  userAgent: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "text", nullable: true })
  userId?: string;

  @Column({ type: "text", nullable: true })
  activeOrganizationId: string;

  @Column({ type: "text", nullable: true })
  activeTeamId: string;
}
