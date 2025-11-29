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
import { Quiz } from "@/entities/quiz.js";
import { generateId } from "better-auth";
import { Submission } from "@/entities/submission.js";
import { QuizSession } from "@/entities/quiz-session.js";

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

  @Column({ type: "text", nullable: true })
  quizId?: string;

  @OneToMany(() => Submission, (submission) => submission.result, {
    cascade: true,
  })
  submissions: Submission[];

  @OneToOne(() => QuizSession, (quizSession) => quizSession.result)
  @JoinColumn()
  quizSession: QuizSession;

  @Column({ type: "text", nullable: true })
  quizSessionId?: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
