import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const answerValidationSchema = z.object({
  text: z.string(),
  is_correct: z.boolean().optional(),
  questionId: z.number(),
});

/**
 * Validates the body of a request to create a new answer.
 *
 * @param {Request} req The Express.js request object.
 * @param {Response} res The Express.js response object.
 * @param {NextFunction} next The Express.js next function.
 */
export const AnswerValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    answerValidationSchema.parse(req.body);
    next();
  } catch (error) {
    return next(error);
  }
};
