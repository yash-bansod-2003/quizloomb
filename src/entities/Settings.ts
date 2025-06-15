import "reflect-metadata";
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Quiz } from "@/entities/Quiz.js";

export enum ShuffleMode {
  NONE = "none",
  QUESTIONS = "questions",
  ANSWERS = "answers",
  BOTH = "both",
}

export enum AccessControl {
  PUBLIC = "public",
  PASSWORD = "password",
  EMAIL_DOMAIN = "email_domain",
  INVITE_ONLY = "invite_only",
}

@Entity("settings")
export class Settings {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, type: "timestamp" })
  startTime: Date;

  @Column({ nullable: true, type: "timestamp" })
  endTime: Date;

  @Column({ default: false, type: "boolean" })
  hasTimeLimit: boolean;

  @Column({ default: 30, type: "int" })
  durationMinutes: number;

  @Column({ default: true, type: "boolean" })
  fullscreen: boolean;

  @Column({ default: false, type: "boolean" })
  preventNewTab: boolean;

  @Column({
    type: "enum",
    enum: ShuffleMode,
    default: ShuffleMode.NONE,
  })
  shuffleMode: string;

  @Column({ default: 1, type: "int" })
  maxAttempts: number;

  @Column({ default: true, type: "boolean" })
  showResultsAfterSubmission: boolean;

  @Column({ default: false, type: "boolean" })
  showCorrectAnswers: boolean;

  @Column({
    type: "enum",
    enum: AccessControl,
    default: AccessControl.PUBLIC,
  })
  accessControl: string;

  @Column({ nullable: true, type: "varchar" })
  accessPassword: string;

  @Column({ nullable: true, type: "varchar" })
  allowedEmailDomains: string;

  @Column({ default: false, type: "boolean" })
  ipRestriction: boolean;

  @Column({ nullable: true, type: "simple-array" })
  allowedIpAddresses: string[];

  @Column({ default: false, type: "boolean" })
  enableProctoring: boolean;

  @Column({ default: false, type: "boolean" })
  webcamRequired: boolean;

  @Column({ default: false, type: "boolean" })
  recordScreen: boolean;

  @Column({ default: false, type: "boolean" })
  preventCopyPaste: boolean;

  @Column({ default: true, type: "boolean" })
  allowNavigationBetweenQuestions: boolean;

  @Column({ default: false, type: "boolean" })
  randomizeQuestions: boolean;

  @Column({ default: false, type: "boolean" })
  oneQuestionPerPage: boolean;

  @Column({ default: true, type: "boolean" })
  showProgress: boolean;

  @Column({ default: false, type: "boolean" })
  allowSaveProgress: boolean;

  @OneToOne(() => Quiz, (quiz) => quiz.settings)
  quiz: Quiz;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
