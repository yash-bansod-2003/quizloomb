import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Organization } from "./Organization.js";
import { TeamMember } from "./TeamMember.js";
import { Invitation } from "./Invitation.js";

@Entity("team")
export class Team {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "text" })
  name: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.teams)
  organization: Organization;

  @OneToMany(() => TeamMember, (teamMember) => teamMember.team, {
    cascade: true,
  })
  teamMembers: TeamMember[];

  @OneToMany(() => Invitation, (invitation) => invitation.team)
  invitations: Invitation[];
}
