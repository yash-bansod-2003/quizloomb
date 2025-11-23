import {
  Entity,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  ManyToMany,
} from "typeorm";
import { Question } from "@/entities/Question.js";
import { Quiz } from "@/entities/Quiz.js";
import { Option } from "@/entities/Option.js";
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

  @ManyToOne(() => Quiz, (quiz) => quiz.submissions, {
    onDelete: "CASCADE",
  })
  quiz: Quiz;

  @ManyToOne(() => Question, (question) => question.submissions, {
    onDelete: "CASCADE",
  })
  question: Question;

  @ManyToMany(() => Option, (option) => option.submissions, {
    cascade: true,
  })
  options: Option[];

  @ManyToOne(() => Result, (result) => result.submissions, {
    onDelete: "CASCADE",
  })
  result: Result;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
