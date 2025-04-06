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

@Entity("settings")
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    enum: ["single_page", "paginated"],
    default: "paginated",
  })
  questionDisplayMode: string;

  @Column({
    type: "text",
    enum: ["none", "shuffle_questions", "shuffle_answers", "shuffle_both"],
    default: "shuffle_both",
  })
  randomizationPolicy: string;

  @Column({ default: true, type: "boolean" })
  fullscreen: boolean;

  @Column({ default: {}, type: "jsonb" })
  fields: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Quiz, (quiz) => quiz.settings)
  quiz: Quiz;
}
