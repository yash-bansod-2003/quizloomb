import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Session } from "./Session.js";
import { Account } from "./Account.js";
import { Quiz } from "../Quiz.js";

@Entity("user")
export class User {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "text", nullable: true })
  name: string;

  @Column({ type: "boolean" })
  emailVerified: boolean;

  @Column({ type: "text", nullable: true })
  image: string;

  @Column({ type: "int", default: 20 })
  credits: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => Session, (session) => session.user, { cascade: true })
  sessions: Session[];

  @OneToMany(() => Account, (account) => account.user, { cascade: true })
  accounts: Account[];

  @OneToMany(() => Quiz, (quiz) => quiz.user, { cascade: true })
  quizzes: Quiz[];
}
