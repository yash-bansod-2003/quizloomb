import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Quiz } from "@/models/Quiz.js";

@Entity("results")
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  score: number;

  @Column({ type: "int", default: 1 })
  attempt: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: "text", nullable: false })
  session_id: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.results)
  quiz: Quiz;
}
