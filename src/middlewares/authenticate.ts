import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { auth } from "@/lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import configuration from "@/lib/configuration.js";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    name: string;
    emailVerified: boolean;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined;
  };
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // better-auth expects an origin header to validate trusted origins.
  // If the incoming request has no origin (or it's null), fall back to our configured domain.
  const incomingHeaders = { ...req.headers } as Record<string, unknown>;
  if (!incomingHeaders.origin) {
    incomingHeaders.origin = configuration.domain;
  }
  if (!incomingHeaders.referer && req.headers.referer) {
    incomingHeaders.referer = req.headers.referer;
  }

  const session = await auth.api.getSession({
    headers: fromNodeHeaders(incomingHeaders as Record<string, string>),
  });
  if (!session) {
    return next(createHttpError.Unauthorized());
  }
  req["user"] = session.user;
  next();
};

export default authenticate;
