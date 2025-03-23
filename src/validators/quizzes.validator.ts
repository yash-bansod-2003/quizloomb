import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const quizValidationSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const QuizValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    quizValidationSchema.parse(req.body);
    next();
  } catch (error) {
    return next(error);
  }
};
