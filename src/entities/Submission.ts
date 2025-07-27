import {
  Entity,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from "typeorm";
import { Question } from "@/entities/Question.js";
import { Quiz } from "@/entities/Quiz.js";
import { Answer } from "@/entities/Answer.js";
import { generateId } from "better-auth";
import { Result } from "./Result.js";

@Entity("submissions")
export class Submission {
  @PrimaryColumn({ type: "text" })
  id: string;

  @BeforeInsert()
  beforeInsert() {
    this.id = generateId();
  }

  @Column({ type: "text", nullable: false })
  sessionId: string;

  @Column({ type: "jsonb", nullable: false })
  fields: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.submissions, {
    onDelete: "CASCADE",
  })
  quiz: Quiz;

  @ManyToOne(() => Question, (question) => question.submissions, {
    onDelete: "CASCADE",
  })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.submissions, {
    onDelete: "CASCADE",
  })
  answer: Answer;

  @ManyToOne(() => Result, (result) => result.submissions, {
    onDelete: "CASCADE",
  })
  result: Result;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
