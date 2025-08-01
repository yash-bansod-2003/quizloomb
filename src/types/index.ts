import { QuestionType } from "@/entities/Question.js";

export type Question =
  | MCQQuestion
  | TrueFalseQuestion
  | WrittenQuestion
  | MultiSelectQuestion;

export interface BaseQuestion {
  lineStart: number;
  type: string;
  question: string;
  tags: string[];
}

export interface MCQQuestion extends BaseQuestion {
  type: "mcq";
  options: string[];
  correct: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "true_false";
  correct: boolean;
}

export interface WrittenQuestion extends BaseQuestion {
  type: "written";
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: "multi_select";
  options: string[];
  correct: string[];
}

export interface QuizQuestion {
  type: QuestionType;
  question: string;
  options?: string[];
  correct?: string | string[] | boolean;
  tags: string[];
  lineStart: number;
}

export interface ParseResult {
  quiz: {
    title: string;
    description: string;
    questions: QuizQuestion[];
  };
  errors: string[];
}

export interface QuizTokenPayload {
  id: string;
  sessionId: string;
  resultId: string;
  expiry: Date;
}

export interface Field {
  name: string;
  type: string;
  label: string;
  enabled: boolean;
  required: boolean;
  placeholder: string;
}
