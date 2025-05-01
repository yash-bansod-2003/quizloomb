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
