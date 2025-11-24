import {
  Entity,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  ManyToMany,
  JoinColumn,
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

  @Column({ type: "boolean", default: false })
  isCorrect: boolean;

  @Column({ type: "int", default: 0 })
  pointsEarned: number;

  @Column({ type: "text", nullable: true })
  text?: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.submissions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "quizId" })
  quiz: Quiz;

  @ManyToOne(() => Question, (question) => question.submissions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "questionId" })
  question: Question;

  @ManyToMany(() => Option, (option) => option.submissions)
  options: Option[];

  @ManyToOne(() => Result, (result) => result.submissions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "resultId" })
  result: Result;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
