import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const questionValidationSchema = z.object({
  quizId: z.string(),
  text: z.string(),
  type: z.enum(["mcq", "true_false", "written"]),
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
