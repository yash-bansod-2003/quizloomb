import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Column,
} from "typeorm";
import { User } from "./auth/User.js";
import { Team } from "./Team.js";

@Entity("teamMember")
export class TeamMember {
  @PrimaryColumn({ type: "text" })
  id: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.teamMembers)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "text", nullable: true })
  userId?: string;

  @ManyToOne(() => Team, (team) => team.teamMembers)
  @JoinColumn({ name: "teamId" })
  team: Team;

  @Column({ type: "text", nullable: true })
  teamId?: string;
}
