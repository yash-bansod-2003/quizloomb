import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Column,
} from "typeorm";
import { User } from "@/entities/auth/user.js";
import { Team } from "@/entities/team.js";

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
