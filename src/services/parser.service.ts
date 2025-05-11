import { QuestionType, QuizQuestion } from "@/types/index.js";

class Parser {
  constructor() {}
  parse(text: string) {
    const lines = text.split(/\r?\n/);
    const errors: string[] = [];
    const questions: QuizQuestion[] = [];

    let quizName = "";
    let quizDescription = "";

    let currentQuestionLines: string[] = [];
    let inQuestion = false;
    let questionLineStart = 0;

    const flushQuestion = (lines: string[], lineStart: number) => {
      const questionObj: Partial<QuizQuestion> = { lineStart };
      const options: string[] = [];
      const correctOptions: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lineNumber = lineStart + i;

        if (line.startsWith("type:")) {
          const type = line.split(":")[1]?.trim() as QuestionType;
          if (
            !["mcq", "true_false", "written", "multi_select"].includes(type)
          ) {
            errors.push(`Line ${lineNumber}: Unknown question type "${type}"`);
          } else {
            questionObj.type = type;
          }
        } else if (line.startsWith("question:")) {
          questionObj.question = line.substring(9).trim();
        } else if (line.startsWith("correct:")) {
          const val = line.split(":")[1]?.trim();
          if (val === "true" || val === "false") {
            questionObj.correct = val === "true";
          } else {
            questionObj.correct = val;
          }
        } else if (line.startsWith("tags:")) {
          questionObj.tags =
            line
              .split(":")[1]
              ?.split(",")
              .map((tag) => tag.trim()) || [];
        } else if (line.startsWith("options:")) {
          // start collecting options
          continue;
        } else if (/^\d+\./.test(line)) {
          const match = line.match(/^(\d+)\.\s*(.+?)(\s*\[correct\])?$/);
          if (!match) {
            errors.push(`Line ${lineNumber}: Malformed option line "${line}"`);
            continue;
          }
          const [, , optionText, correctFlag] = match;
          options.push(optionText.trim());
          if (correctFlag) {
            correctOptions.push(optionText.trim());
          }
        } else if (line.length === 0) {
          continue;
        } else {
          errors.push(
            `Line ${lineNumber}: Unknown or misplaced line "${line}"`,
          );
        }
      }

      if (!questionObj.type) {
        errors.push(`Line ${lineStart}: Missing "type" field`);
        return;
      }

      if (!questionObj.question) {
        errors.push(`Line ${lineStart}: Missing "question" field`);
        return;
      }

      if (!questionObj.tags || questionObj.tags.length === 0) {
        errors.push(`Line ${lineStart}: Missing or empty "tags" field`);
      }

      if (["mcq", "multi_select"].includes(questionObj.type)) {
        if (options.length === 0) {
          errors.push(`Line ${lineStart}: No options provided`);
          return;
        }
        questionObj.options = options;
        if (correctOptions.length === 0) {
          errors.push(`Line ${lineStart}: No correct option marked`);
          return;
        }
        questionObj.correct =
          questionObj.type === "mcq" ? correctOptions[0] : correctOptions;
      }

      questions.push(questionObj as QuizQuestion);
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (index === 0 && trimmed.startsWith("name:")) {
        quizName = trimmed.split(":")[1]?.trim() || "";
      } else if (index === 1 && trimmed.startsWith("description:")) {
        quizDescription = trimmed.split(":")[1]?.trim() || "";
      } else if (trimmed === "---question---") {
        if (inQuestion) {
          flushQuestion(currentQuestionLines, questionLineStart);
          currentQuestionLines = [];
          questionLineStart = index + 1;
        } else {
          questionLineStart = index + 1;
        }
        inQuestion = true;
      } else if (inQuestion) {
        currentQuestionLines.push(line);
      }
    });

    if (inQuestion && currentQuestionLines.length > 0) {
      flushQuestion(currentQuestionLines, questionLineStart);
    }

    return {
      quiz: {
        name: quizName,
        description: quizDescription,
        questions,
      },
      errors,
    };
  }
}

export default Parser;
