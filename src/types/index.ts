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

export type QuestionType = "mcq" | "true_false" | "written" | "multi_select";

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
  durationMinutes: number;
  startTime: Date;
  sessionId: string;
  user: {
    id: string;
    email: string;
  };
}
