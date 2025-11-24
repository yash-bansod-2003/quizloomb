import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { generateId } from "better-auth";
import { Result } from "@/entities/Result.js";
import { Quiz } from "./Quiz.js";

@Entity("quiz_sessions")
export class QuizSession {
  @PrimaryColumn({ type: "text" })
  id: string;

  @BeforeInsert()
  beforeInsert() {
    const id = generateId();
    this.id = id;
  }

  @Column({ type: "timestamp" })
  expiry: Date;

  @Column({ type: "jsonb" })
  fields: string;

  @Column("text", { array: true })
  questions: string[];

  @ManyToOne(() => Quiz, (quiz) => quiz.quizSessions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "quizId" })
  quiz: Quiz;

  @Column({ type: "text", nullable: true })
  quizId?: string;

  @OneToOne(() => Result, (result) => result.quizSession)
  result: Result;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
