import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Quiz } from "@/entities/Quiz.js";
import { User } from "@/entities/auth/User.js";

@Entity("results")
export class Result {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
