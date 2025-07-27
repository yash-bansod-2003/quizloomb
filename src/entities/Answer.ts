import "reflect-metadata";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { Question } from "@/entities/Question.js";
import { Submission } from "@/entities/Submission.js";
import { generateId } from "better-auth";

@Entity("answers")
export class Answer {
  @PrimaryColumn({ type: "text" })
  id: string;

  @BeforeInsert()
  beforeInsert() {
    this.id = generateId();
  }

  @Column({ type: "text" })
  text: string;

  @Column({ default: false, type: "boolean" })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: "CASCADE",
  })
  question: Question;

  @OneToMany(() => Submission, (submission) => submission.answer)
  submissions: Submission[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
