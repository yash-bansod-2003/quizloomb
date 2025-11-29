import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  OneToMany,
} from "typeorm";
import { Member } from "@/entities/member.js";
import { Invitation } from "@/entities/invitation.js";
import { Team } from "@/entities/team.js";

@Entity("organization")
export class Organization {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", unique: true })
  slug: string;

  @Column({ type: "text", nullable: true })
  logo?: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "text", nullable: true })
  metadata?: string;

  @OneToMany(() => Member, (member) => member.organization)
  members: Member[];

  @OneToMany(() => Invitation, (invitation) => invitation.organization)
  invitations: Invitation[];

  @OneToMany(() => Team, (team) => team.organization)
  teams: Team[];
}
