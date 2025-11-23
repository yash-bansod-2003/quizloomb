import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./auth/User.js";
import { Organization } from "./Organization.js";

@Entity("member")
export class Member {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "text", default: "member" })
  role: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.members, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Organization, (organization) => organization.members, {
    onDelete: "CASCADE",
  })
  organization: Organization;
}
