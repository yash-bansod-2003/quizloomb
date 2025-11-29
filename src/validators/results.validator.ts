import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const resultValidationSchema = z.object({
  quizId: z.string(),
});

export const resultQueryValidationSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().optional(),
});

/**
 * Validates the body of a request to create a new answer.
 *
 * @param {Request} req The Express.js request object.
 * @param {Response} res The Express.js response object.
 * @param {NextFunction} next The Express.js next function.
 */
export const ResultValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    resultValidationSchema.parse(req.body);
    next();
  } catch (error) {
    return next(error);
  }
};
