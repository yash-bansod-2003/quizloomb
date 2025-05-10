import "reflect-metadata";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { Quiz } from "@/models/Quiz.js";

// Enum for shuffle options
export enum ShuffleMode {
  NONE = "none",
  QUESTIONS = "questions",
  ANSWERS = "answers",
  BOTH = "both",
}

// Enum for access control
export enum AccessControl {
  PUBLIC = "public",
  PASSWORD = "password",
  EMAIL_DOMAIN = "email_domain",
  INVITE_ONLY = "invite_only",
}

@Entity("settings")
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: "timestamp" })
  start_time: Date;

  @Column({ nullable: true, type: "timestamp" })
  end_time: Date;

  @Column({ default: false, type: "boolean" })
  has_time_limit: boolean;

  @Column({ default: 30, type: "int" })
  duration_minutes: number;

  @Column({ default: true, type: "boolean" })
  fullscreen: boolean;

  @Column({ default: false, type: "boolean" })
  prevent_new_tab: boolean;

  @Column({
    type: "enum",
    enum: ShuffleMode,
    default: ShuffleMode.NONE,
  })
  shuffle_mode: ShuffleMode;

  @Column({ default: 1, type: "int" })
  max_attempts: number;

  @Column({ default: true, type: "boolean" })
  show_results_after_submission: boolean;

  @Column({ default: false, type: "boolean" })
  show_correct_answers: boolean;

  @Column({
    type: "enum",
    enum: AccessControl,
    default: AccessControl.PUBLIC,
  })
  access_control: AccessControl;

  @Column({ nullable: true, type: "varchar" })
  access_password: string;

  @Column({ nullable: true, type: "varchar" })
  allowed_email_domains: string;

  @Column({ default: false, type: "boolean" })
  ip_restriction: boolean;

  @Column({ nullable: true, type: "simple-array" })
  allowed_ip_addresses: string[];

  @Column({ default: false, type: "boolean" })
  enable_proctoring: boolean;

  @Column({ default: false, type: "boolean" })
  webcam_required: boolean;

  @Column({ default: false, type: "boolean" })
  record_screen: boolean;

  @Column({ default: false, type: "boolean" })
  prevent_copy_paste: boolean;

  @Column({ default: true, type: "boolean" })
  allow_navigation_between_questions: boolean;

  @Column({ default: false, type: "boolean" })
  randomize_questions: boolean;

  @Column({ default: false, type: "boolean" })
  one_question_per_page: boolean;

  @Column({ default: true, type: "boolean" })
  show_progress: boolean;

  @Column({ default: false, type: "boolean" })
  allow_save_progress: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Quiz, (quiz) => quiz.settings)
  quiz: Quiz;
}
