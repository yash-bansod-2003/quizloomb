import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const userValidationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
});

export const userValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    userValidationSchema.parse(req.body);
    return next();
  } catch (error) {
    return next(error);
  }
};
