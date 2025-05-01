import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const loginValidationSchema = z
  .object({
    email: z.string(),
    password: z.string(),
    role: z.enum(["student", "user"]),
  })
  .strict();

export const loginValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    loginValidationSchema.parse(req.body);
    return next();
  } catch (error) {
    return next(error);
  }
};

export const forgotValidationSchema = z
  .object({
    email: z.string(),
  })
  .strict();

export const forgotValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    forgotValidationSchema.parse(req.body);
    return next();
  } catch (error) {
    return next(error);
  }
};

export const resetValidationSchema = z
  .object({
    password: z.string(),
  })
  .strict();

export const resetValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    resetValidationSchema.parse(req.body);
    z.object({
      token: z.string(),
    })
      .strict()
      .parse(req.params);
    return next();
  } catch (error) {
    return next(error);
  }
};
