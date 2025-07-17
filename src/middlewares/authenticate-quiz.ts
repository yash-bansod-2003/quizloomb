import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { QuizTokenPayload } from "@/types/index.js";
import configuration from "@/lib/configuration.js";
import TokensService from "@/services/tokens.service.js";
import { COOKIE_PROPERTIES } from "@/lib/constants.js";

export interface AuthenticatedQuizRequest extends Request {
  quiz: QuizTokenPayload;
}

const quizzesTokensService = new TokensService(configuration.jwt.quiz.secret);

const authenticateQuiz = (req: Request, res: Response, next: NextFunction) => {
  const quizToken = req.cookies[
    COOKIE_PROPERTIES.QUIZ_TOKEN_COOKIE_NAME
  ] as string;
  if (!quizToken) {
    return next(createHttpError.Unauthorized());
  }
  const match = quizzesTokensService.verify(quizToken);

  if (!match) {
    return next(createHttpError.Unauthorized());
  }

  req["quiz"] = match;
  next();
};

export default authenticateQuiz;
