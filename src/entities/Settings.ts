import "reflect-metadata";
import {
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { Quiz } from "@/entities/Quiz.js";
import { generateId } from "@/lib/utils.js";

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
  @PrimaryColumn({ type: "text" })
  id: string;

  @BeforeInsert()
  beforeInsert() {
    this.id = generateId();
  }

  @Column({ nullable: true, type: "timestamp" })
  startTime: Date;

  @Column({ nullable: true, type: "timestamp" })
  endTime: Date;

  @Column({ default: false, type: "boolean" })
  hasTimeLimit: boolean;

  @Column({ default: 30, type: "int" })
  durationMinutes: number;

  @Column({ nullable: true, type: "int" })
  numberOfQuestionsToDisplay: number;

  @Column({ default: true, type: "boolean" })
  showTotalQuestionsAtStart: boolean;

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

  @Column({ default: true, type: "boolean" })
  showCountdownTimer: boolean;

  @Column({ default: false, type: "boolean" })
  autoProgressToNextQuiz: boolean;

  @Column({ default: false, type: "boolean" })
  progressOnlyOnPass: boolean;

  @Column({ type: "enum", enum: ["manual", "automatic"], default: "manual" })
  nextQuizTransitionMode: "manual" | "automatic";

  @Column({ nullable: true, type: "varchar" })
  timeZone: string;

  @Column({ default: false, type: "boolean" })
  ipRestriction: boolean;

  @Column({ nullable: true, type: "simple-array" })
  allowedIpAddresses: string[];

  @Column({ nullable: true, type: "varchar" })
  ipRangeStart: string;

  @Column({ nullable: true, type: "varchar" })
  ipRangeEnd: string;

  @Column({ default: false, type: "boolean" })
  enableProctoring: boolean;

  @Column({ default: false, type: "boolean" })
  webcamRequired: boolean;

  @Column({ default: false, type: "boolean" })
  recordScreen: boolean;

  @Column({ default: false, type: "boolean" })
  preventCopyPaste: boolean;

  @Column({ default: false, type: "boolean" })
  disablePrintScreen: boolean;

  @Column({ default: false, type: "boolean" })
  disableCopy: boolean;

  @Column({ default: false, type: "boolean" })
  restrictTabSwitching: boolean;

  @Column({ default: false, type: "boolean" })
  disablePasteInEssay: boolean;

  @Column({ default: false, type: "boolean" })
  highlightPastedEssayContent: boolean;

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

  @Column({ default: 100, type: "int" })
  totalPoints: number;

  @Column({ nullable: true, type: "float" })
  passingScore: number;

  @Column({ default: false, type: "boolean" })
  negativeMarking: boolean;

  @Column({ nullable: true, type: "float" })
  negativePointsPerWrongAnswer: number;

  @Column({ default: true, type: "boolean" })
  allowSkipQuestions: boolean;

  @Column({ default: false, type: "boolean" })
  detectAbsence: boolean;

  @Column({ default: false, type: "boolean" })
  detectDeskExit: boolean;

  @Column({ default: false, type: "boolean" })
  detectMultiplePeople: boolean;

  @Column({ default: false, type: "boolean" })
  detectWindowSwitch: boolean;

  @Column({ default: false, type: "boolean" })
  enableGazeDetection: boolean;

  @Column({ default: 5, type: "int" })
  gazeAwayThresholdSeconds: number;

  @OneToOne(() => Quiz, (quiz) => quiz.settings)
  quiz: Quiz;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
