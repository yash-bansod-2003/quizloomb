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

export enum QuestionType {
  MCQ = "mcq",
  TRUE_FALSE = "trueFalse",
  MULTI_SELECT = "multiSelect",
  WRITTEN = "written",
  VIDEO = "video",
  RATING = "rating",
  FILE_UPLOAD = "fileUpload",
  RANKING = "ranking",
  MATRIX = "matrix",
}

export enum Difficulty {
  HIGH = "high",
  LOW = "low",
  MEDIUM = "medium",
}

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
    type: "enum",
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({ type: "int", default: 1 })
  points: number;

  @Column({
    type: "enum",
    enum: Difficulty,
    default: Difficulty.MEDIUM,
  })
  difficulty: Difficulty;

  @Column("text", { array: true })
  tags: string[];

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
    onDelete: "CASCADE",
  })
  quiz: Quiz;

  @OneToMany(() => Answer, (answer) => answer.question, {
    cascade: true,
  })
  answers: Answer[];

  @OneToMany(() => Submission, (submission) => submission.question)
  submissions: Submission[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
