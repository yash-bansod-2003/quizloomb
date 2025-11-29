import "reflect-metadata";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToMany,
  JoinColumn,
} from "typeorm";
import { Question } from "@/entities/question.js";
import { Submission } from "@/entities/submission.js";
import { generateId } from "better-auth";

@Entity("options")
export class Option {
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

  @ManyToOne(() => Question, (question) => question.options, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "questionId" })
  question: Question;

  @Column({ type: "text", nullable: true })
  questionId?: string;

  @ManyToMany(() => Submission, (submission) => submission.options)
  submissions: Submission[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
