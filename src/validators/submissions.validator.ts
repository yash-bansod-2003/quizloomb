import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const submissionValidationSchema = z.object({
  quizId: z.string(),
  questionId: z.string(),
  optionIds: z.array(z.string()).optional(),
  text: z.string().optional(),
});

/**
 * Validates the body of a request to create a new submission.
 *
 * @param {Request} req The Express.js request object.
 * @param {Response} res The Express.js response object.
 * @param {NextFunction} next The Express.js next function.
 */
export const SubmissionValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    submissionValidationSchema.parse(req.body);
    next();
  } catch (error) {
    return next(error);
  }
};
