import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./auth/User.js";
import { Team } from "./Team.js";

@Entity("teamMember")
export class TeamMember {
  @PrimaryColumn({ type: "text" })
  id: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.teamMembers)
  user: User;

  @ManyToOne(() => Team, (team) => team.teamMembers)
  team: Team;
}
