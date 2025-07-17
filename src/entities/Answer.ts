import "reflect-metadata";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Question } from "@/entities/Question.js";
import { Submission } from "@/entities/Submission.js";

@Entity("answers")
export class Answer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  text: string;

  @Column({ default: false, type: "boolean" })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @OneToMany(() => Submission, (submission) => submission.answer)
  submissions: Submission[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
