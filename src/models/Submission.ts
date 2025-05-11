import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from "typeorm";
import { Question } from "@/models/Question.js";
import { Quiz } from "@/models/Quiz.js";
import { Answer } from "@/models/Answer.js";

@Entity("submissions")
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", default: 1 })
  attempt: number;

  @Column({ type: "text", nullable: false })
  session_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.submissions)
  quiz: Quiz;

  @ManyToOne(() => Question, (question) => question.submissions)
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.submissions)
  answer: Answer;
}
