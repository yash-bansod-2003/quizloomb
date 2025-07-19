import { Router } from "express";
import { AppDataSource } from "@/data-source.js";
import authenticate from "@/middlewares/authenticate.js";
import logger from "@/lib/logger.js";
import { ResultValidator } from "@/validators/results.validator.js";
import { User } from "@/entities/auth/User.js";
import { Quiz } from "@/entities/Quiz.js";
import UserService from "@/services/users.service.js";
import QuizzesService from "@/services/quizzes.service.js";
import { Result } from "@/entities/Result.js";
import ResultsService from "@/services/results.service.js";
import ResultsController from "@/controllers/results.controller.js";
import { Submission } from "@/entities/Submission.js";
import SubmissionsService from "@/services/submissions.service.js";
import authenticateQuiz from "@/middlewares/authenticate-quiz.js";

const router = Router();

const usersRepository = AppDataSource.getRepository(User);
const quizzesRepository = AppDataSource.getRepository(Quiz);
const resultsRepository = AppDataSource.getRepository(Result);
const submissionsRepository = AppDataSource.getRepository(Submission);

const usersService = new UserService(usersRepository);
const quizzessService = new QuizzesService(quizzesRepository);
const resultsService = new ResultsService(resultsRepository);
const submissionsService = new SubmissionsService(submissionsRepository);

const resultsController = new ResultsController(
  resultsService,
  usersService,
  quizzessService,
  submissionsService,
  logger,
);

router.post(
  "/",
  authenticate,
  authenticateQuiz,
  ResultValidator,
  async (req, res, next) => {
    await resultsController.create(req, res, next);
  },
);

router.get("/", authenticate, async (req, res, next) => {
  await resultsController.findAll(req, res, next);
});

router.get("/:id", authenticate, async (req, res, next) => {
  await resultsController.findOne(req, res, next);
});

router.delete("/:id", authenticate, async (req, res, next) => {
  await resultsController.delete(req, res, next);
});

export default router;
