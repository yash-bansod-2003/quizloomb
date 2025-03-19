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

  @Column({ default: true, type: "boolean" })
  fullscreen: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Quiz, (quiz) => quiz.settings)
  quiz: Quiz;
}
