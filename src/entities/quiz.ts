import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from "typeorm";
import { User } from "@/entities/auth/user.js";
import { Question } from "@/entities/question.js";
import { Submission } from "@/entities/submission.js";
import { Result } from "@/entities/result.js";
import { Settings } from "@/entities/settings.js";
import { generateId } from "better-auth";
import { QuizSession } from "@/entities/quiz-session.js";

export enum QuizStatus {
  DRAFT = "draft",
  LIVE = "live",
  PAUSED = "paused",
  SCHEDULED = "scheduled",
  CLOSED = "closed",
}

@Entity("quizzes")
export class Quiz {
  @PrimaryColumn({ type: "text" })
  id: string;

  @BeforeInsert()
  beforeInsert() {
    const id = generateId();
    this.id = id;
  }

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text", nullable: true })
  image?: string;

  @Column({ type: "text", nullable: true })
  bannerImage?: string;

  @Column({
    type: "enum",
    enum: QuizStatus,
    default: QuizStatus.LIVE,
  })
  status: QuizStatus;

  @Column({ type: "text" })
  description: string;

  @ManyToOne(() => User, (user) => user.quizzes, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "text", nullable: true })
  userId?: string;

  @OneToMany(() => Question, (question) => question.quiz, {
    cascade: true,
  })
  questions: Question[];

  @OneToMany(() => Submission, (submission) => submission.quiz)
  submissions: Submission[];

  @OneToMany(() => Result, (result) => result.quiz)
  results: Result[];

  @OneToMany(() => QuizSession, (quizSession) => quizSession.quiz)
  quizSessions: QuizSession[];

  @OneToOne(() => Settings, (settings) => settings.quiz, {
    cascade: true,
  })
  @JoinColumn()
  settings: Settings;

  @Column({ type: "text", nullable: true })
  settingsId?: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
