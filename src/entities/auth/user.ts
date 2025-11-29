import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Session } from "@/entities/auth/session.js";
import { Account } from "@/entities/auth/account.js";
import { Quiz } from "../quiz.js";
import { Member } from "../member.js";
import { Invitation } from "../invitation.js";
import { TeamMember } from "../team-member.js";

@Entity("user")
export class User {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "text", nullable: true })
  name: string;

  @Column({ type: "text", unique: true })
  email: string;

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

  @OneToMany(() => Member, (member) => member.user, { cascade: true })
  members: Member[];

  @OneToMany(() => TeamMember, (teamMember) => teamMember.user)
  teamMembers: TeamMember[];

  @OneToMany(() => Invitation, (invitation) => invitation.user, {
    cascade: true,
  })
  invitations: Invitation[];

  @OneToMany(() => Quiz, (quiz) => quiz.user, { cascade: true })
  quizzes: Quiz[];
}
