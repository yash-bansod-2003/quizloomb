import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Quiz } from "@/entities/Quiz.js";
import { generateId } from "better-auth";
import { Submission } from "./Submission.js";
import { QuizSession } from "./QuizSession.js";

export enum ResultStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

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

  @Column({
    type: "enum",
    enum: ResultStatus,
    default: ResultStatus.PENDING,
  })
  status: ResultStatus;

  @Column({ type: "text", nullable: false })
  system: string;

  @Column({ type: "jsonb", nullable: true })
  location?: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.results, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "quizId" })
  quiz: Quiz;

  @OneToMany(() => Submission, (submission) => submission.result, {
    cascade: true,
  })
  submissions: Submission[];

  @OneToOne(() => QuizSession, (quizSession) => quizSession.result)
  @JoinColumn()
  quizSession: QuizSession;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
