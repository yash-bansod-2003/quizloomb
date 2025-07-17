import {
  Entity,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "@/entities/Question.js";
import { Quiz } from "@/entities/Quiz.js";
import { Answer } from "@/entities/Answer.js";
import { User } from "@/entities/auth/User.js";

@Entity("submissions")
export class Submission {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", default: 1 })
  attempt: number;

  @Column({ type: "text", nullable: false })
  sessionId: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.submissions)
  quiz: Quiz;

  @ManyToOne(() => Question, (question) => question.submissions)
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.submissions)
  answer: Answer;

  @ManyToOne(() => User, (user) => user.submissions, {
    onDelete: "CASCADE",
  })
  user: User;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
