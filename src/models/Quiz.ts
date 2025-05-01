import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "@/models/User.js";
import { Question } from "@/models/Question.js";
import { Submission } from "@/models/Submission.js";
import { Result } from "@/models/Result.js";
import { Settings } from "@/models/Settings.js";

@Entity("quizzes")
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

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
}
