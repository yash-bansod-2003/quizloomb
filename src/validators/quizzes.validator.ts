import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const quizValidationSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const quizQueryValidationSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().optional(),
  search: z.string().optional(),
});

export const QuizValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    quizValidationSchema.parse(req.body);
    quizQueryValidationSchema.parse(req.query);
    next();
  } catch (error) {
    return next(error);
  }
};
