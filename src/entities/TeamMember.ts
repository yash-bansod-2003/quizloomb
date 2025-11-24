import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
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

  @ManyToOne(() => Team, (team) => team.teamMembers)
  @JoinColumn({ name: "teamId" })
  team: Team;
}
