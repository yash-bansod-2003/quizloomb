import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { QuestionType } from "@/entities/question.js";

export const questionValidationSchema = z.object({
  quizId: z.string(),
  text: z.string(),
  type: z.enum(QuestionType),
});

export const questionQueryValidationSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().optional(),
  search: z.string().optional(),
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
