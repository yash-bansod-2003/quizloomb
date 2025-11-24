import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./auth/User.js";
import { Organization } from "./Organization.js";
import { Team } from "./Team.js";

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

  @ManyToOne(() => User, (user) => user.invitations, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Organization, (organization) => organization.members)
  organization: Organization;

  @ManyToOne(() => Team, (team) => team.invitations)
  team: Team;
}
