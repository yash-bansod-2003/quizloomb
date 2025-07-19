import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from "typeorm";
import { Quiz } from "@/entities/Quiz.js";
import { Answer } from "@/entities/Answer.js";
import { Submission } from "@/entities/Submission.js";
import { generateId } from "better-auth";

@Entity("questions")
export class Question {
  @PrimaryColumn({ type: "text" })
  id: string;

  @BeforeInsert()
  beforeInsert() {
    this.id = generateId();
  }

  @Column({ type: "text" })
  text: string;

  @Column({
    enum: ["mcq", "trueFalse", "multiSelect", "written"],
    type: "text",
  })
  type: string;

  @Column("text", { array: true })
  tags: string[];

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  quiz: Quiz;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @OneToMany(() => Submission, (submission) => submission.question)
  submissions: Submission[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
