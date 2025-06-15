import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("verification")
export class Verification {
  @PrimaryColumn({ type: "text" })
  id: string;

  @Column({ type: "text" })
  identifier: string;

  @Column({ type: "text" })
  value: string;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
