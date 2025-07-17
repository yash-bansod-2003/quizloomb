import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { auth } from "@/lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

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
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    return next(createHttpError.Unauthorized());
  }
  req["user"] = session.user;
  next();
};

export default authenticate;
