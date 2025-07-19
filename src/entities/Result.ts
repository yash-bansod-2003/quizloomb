import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { Quiz } from "@/entities/Quiz.js";
import { User } from "@/entities/auth/User.js";
import { generateId } from "@/lib/utils.js";

@Entity("results")
export class Result {
  @PrimaryColumn({ type: "text" })
  id: string;

  @BeforeInsert()
  beforeInsert() {
    this.id = generateId();
  }

  @Column({ type: "int" })
  score: number;

  @Column({ type: "int", default: 1 })
  attempt: number;

  @Column({ type: "text", nullable: false })
  sessionId: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.results)
  quiz: Quiz;

  @ManyToOne(() => User, (user) => user.results, {
    onDelete: "CASCADE",
  })
  user: User;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
