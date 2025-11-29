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

@Entity("member")
export class Member {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "text", default: "member" })
  role: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "text", nullable: true })
  userId?: string;

  @Column({ type: "text", nullable: true })
  organizationId?: string;

  @ManyToOne(() => User, (user) => user.members, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Organization, (organization) => organization.members, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "organizationId" })
  organization: Organization;
}
