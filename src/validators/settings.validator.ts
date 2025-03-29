import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const settingsValidationSchema = z.object({
  fullscreen: z.boolean(),
});

/**
 * Middleware to validate the request body for creating settings.
 *
 * This function uses the `settingsCreateValidationSchema` to parse and validate
 * the request body. If the validation passes, it calls the `next` middleware.
 * If the validation fails, it catches the error and passes it to the `next` middleware.
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
export const SettingsValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    settingsValidationSchema.parse(req.body);
    next();
  } catch (error) {
    return next(error);
  }
};
