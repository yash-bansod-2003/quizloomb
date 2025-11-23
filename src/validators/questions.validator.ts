import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { QuestionType } from "@/entities/Question.js";

export const questionValidationSchema = z.object({
  quizId: z.string(),
  text: z.string(),
  type: z.enum(QuestionType),
});

export const QuestionValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    questionValidationSchema.parse(req.body);
    next();
  } catch (error) {
    return next(error);
  }
};
