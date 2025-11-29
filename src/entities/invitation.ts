import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "@/entities/auth/user.js";
import { Organization } from "@/entities/organization.js";
import { Team } from "@/entities/team.js";

@Entity("invitation")
export class Invitation {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "text", nullable: true })
  role?: string;

  @Column({ type: "text", default: "pending" })
  status: string;

  @CreateDateColumn({ type: "timestamp" })
  expiresAt: Date;

  @Column({ type: "text", nullable: true })
  userId?: string;

  @Column({ type: "text", nullable: true })
  organizationId?: string;

  @Column({ type: "text", nullable: true })
  teamId?: string;

  @ManyToOne(() => User, (user) => user.invitations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Organization, (organization) => organization.invitations)
  @JoinColumn({ name: "organizationId" })
  organization: Organization;

  @ManyToOne(() => Team, (team) => team.invitations)
  @JoinColumn({ name: "teamId" })
  team: Team;
}
