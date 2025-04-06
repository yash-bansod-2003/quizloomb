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

  @Column({ type: "string", nullable: false })
  session_id: number;

  @CreateDateColumn()
  created_at: number;

  @UpdateDateColumn()
  updated_at: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.submissions)
  quiz: Quiz;

  @ManyToOne(() => Question, (question) => question.submissions)
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.submissions)
  answer: Answer;
}
