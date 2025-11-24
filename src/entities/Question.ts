import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  JoinColumn,
} from "typeorm";
import { Quiz } from "@/entities/Quiz.js";
import { Option } from "@/entities/Option.js";
import { Submission } from "@/entities/Submission.js";
import { generateId } from "better-auth";

export enum QuestionType {
  MCQ = "mcq",
  TRUE_FALSE = "trueFalse",
  WRITTEN = "written",
  MULTI_SELECT = "multiSelect",
  SHORT_ANSWER = "shortAnswer",
  FILL_IN_THE_BLANK = "fillInTheBlank",
  MATCHING = "matching",
  ORDERING = "ordering",
  VIDEO_RESPONSE = "videoResponse",
  AUDIO_RESPONSE = "audioResponse",
  RATING = "rating",
  FILE_UPLOAD = "fileUpload",
  SURVEY = "survey",
  CODE_SNIPPET = "codeSnippet",
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
  @JoinColumn({ name: "quizId" })
  quiz: Quiz;

  @OneToMany(() => Option, (option) => option.question, {
    cascade: true,
  })
  options: Option[];

  @OneToMany(() => Submission, (submission) => submission.question)
  submissions: Submission[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
