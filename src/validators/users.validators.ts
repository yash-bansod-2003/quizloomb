import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const createUserValidationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
});

export const userQueryValidationSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().optional(),
  search: z.string().optional(),
});

export const createUserValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    createUserValidationSchema.parse(req.body);
    return next();
  } catch (error) {
    return next(error);
  }
};
