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
import { User } from "@/entities/auth/User.js";
import { Question } from "@/entities/Question.js";
import { Submission } from "@/entities/Submission.js";
import { Result } from "@/entities/Result.js";
import { Settings } from "@/entities/Settings.js";
import { generateId } from "better-auth";

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
  user: User;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];

  @OneToMany(() => Submission, (submission) => submission.quiz)
  submissions: Submission[];

  @OneToMany(() => Result, (result) => result.quiz)
  results: Result[];

  @OneToOne(() => Settings, (settings) => settings.quiz)
  @JoinColumn()
  settings: Settings;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
