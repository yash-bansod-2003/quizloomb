import { Router } from "express";
import OptionsService from "@/services/options.service.js";
import QuestionsService from "@/services/questions.service.js";
import { AppDataSource } from "@/data-source.js";
import authenticate from "@/middlewares/authenticate.js";
import logger from "@/lib/logger.js";
import { SubmissionValidator } from "@/validators/submissions.validator.js";
import { Question } from "@/entities/Question.js";
import { Option } from "@/entities/Option.js";
import { User } from "@/entities/auth/User.js";
import { Quiz } from "@/entities/Quiz.js";
import UserService from "@/services/users.service.js";
import QuizzesService from "@/services/quizzes.service.js";
import { Submission } from "@/entities/Submission.js";
import SubmissionsService from "@/services/submissions.service.js";
import SubmissionsController from "@/controllers/submissions.controller.js";
import authenticateQuiz from "@/middlewares/authenticate-quiz.js";
import ResultsService from "@/services/results.service.js";
import QuizSessionsService from "@/services/quizSessions.service.js";
import { QuizSession } from "@/entities/QuizSession.js";
import { Result } from "@/entities/Result.js";

const router = Router();

const usersRepository = AppDataSource.getRepository(User);
const quizzesRepository = AppDataSource.getRepository(Quiz);
const questionsRepository = AppDataSource.getRepository(Question);
const optionsRepository = AppDataSource.getRepository(Option);
const submissionsRepository = AppDataSource.getRepository(Submission);

const usersService = new UserService(usersRepository);
const quizzesService = new QuizzesService(quizzesRepository);
const questionsService = new QuestionsService(questionsRepository);
const optionsService = new OptionsService(optionsRepository);
const submissionsService = new SubmissionsService(submissionsRepository);
const quizSessionsRepository = AppDataSource.getRepository(QuizSession);
const quizSessionsService = new QuizSessionsService(quizSessionsRepository);
const resultsRepository = AppDataSource.getRepository(Result);
const resultsService = new ResultsService(resultsRepository);

const submissionsController = new SubmissionsController(
  submissionsService,
  usersService,
  quizzesService,
  resultsService,
  quizSessionsService,
  questionsService,
  optionsService,
  logger,
);

router.post(
  "/",
  authenticate,
  authenticateQuiz,
  SubmissionValidator,
  async (req, res, next) => {
    await submissionsController.create(req, res, next);
  },
);

router.get("/", authenticate, async (req, res, next) => {
  await submissionsController.findAll(req, res, next);
});

router.get("/:id", authenticate, async (req, res, next) => {
  await submissionsController.findOne(req, res, next);
});

router.delete("/:id", authenticate, async (req, res, next) => {
  await submissionsController.delete(req, res, next);
});

export default router;
