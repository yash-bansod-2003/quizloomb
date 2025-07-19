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
import { generateId } from "@/lib/utils.js";

@Entity("quizzes")
export class Quiz {
  @PrimaryColumn({ type: "text" })
  id: string;

  @BeforeInsert()
  beforeInsert() {
    this.id = generateId();
  }

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text", nullable: true })
  image?: string;

  @Column({
    enum: ["draft", "live", "paused", "scheduled", "closed"],
    type: "text",
    default: "live",
  })
  status: string;

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
