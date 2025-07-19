import "reflect-metadata";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import usersRouter from "@/routes/users.router.js";
import quizzesRouter from "@/routes/quizzes.router.js";
import questionsRouter from "@/routes/questions.router.js";
import answersRouter from "@/routes/answers.router.js";
import submissionsRouter from "@/routes/submissions.router.js";
import resultsRouter from "@/routes/results.router.js";
import configuration from "@/lib/configuration.js";
import settingsRouter from "@/routes/settings.router.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth.js";

import globalErrorHandler from "@/middlewares/error-handler.js";

export const createServer = (): Express => {
  const app = express();
  app
    .use(helmet({ contentSecurityPolicy: false }))
    .use(cors({ origin: configuration.domain, credentials: true }))
    .use(morgan("dev"))
    .use(cookieParser())
    .all("/api/auth/{*any}", toNodeHandler(auth))
    .use(express.json())
    .get("/message/:name", (req, res) => {
      res.json({ message: `hello ${req.params.name}` });
    })
    .get("/api/status", (_, res) => {
      res.json({ ok: true });
    })
    .use("/api/users", usersRouter)
    .use("/api/quizzes", quizzesRouter)
    .use("/api/questions", questionsRouter)
    .use("/api/answers", answersRouter)
    .use("/api/submissions", submissionsRouter)
    .use("/api/results", resultsRouter)
    .use("/api/settings", settingsRouter)
    .use(globalErrorHandler);
  return app;
};
