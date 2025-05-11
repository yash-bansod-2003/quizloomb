import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Quiz } from "@/models/Quiz.js";
import { RefreshToken } from "@/models/RefreshToken.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  firstName: string;

  @Column({ type: "text" })
  lastName: string;

  @Column({ unique: true, type: "text" })
  email: string;

  @Column({ type: "text" })
  password: string;

  @Column({ type: "boolean", default: false })
  is_verified: boolean;

  @Column({ type: "int", default: 20 })
  credits: number;

  @Column({
    type: "text",
    enum: ["student", "user", "admin"],
    default: "student",
  })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Quiz, (quiz) => quiz.user)
  quizzes: Quiz[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
