import { Router } from "express";
import QuizzesController from "@/controllers/quizzes.controller.js";
import QuizzesService from "@/services/quizzes.service.js";
import UsersService from "@/services/users.service.js";
import { AppDataSource } from "@/data-source.js";
import { Quiz } from "@/entities/Quiz.js";
import authenticate from "@/middlewares/authenticate.js";
import logger from "@/lib/logger.js";
import { QuizValidator } from "@/validators/quizzes.validator.js";
import { User } from "@/entities/auth/User.js";
import Aiservice from "@/services/ai.service.js";
import SettingsService from "@/services/settings.service.js";
import { Settings } from "@/entities/Settings.js";
import { Question } from "@/entities/Question.js";
import QuestionsService from "@/services/questions.service.js";
import { Answer } from "@/entities/Answer.js";
import AnswersService from "@/services/answers.service.js";
import { Result } from "@/entities/Result.js";
import ResultsService from "@/services/results.service.js";
import TokensService from "@/services/tokens.service.js";
import configuration from "@/lib/configuration.js";
import ParserService from "@/services/parser.service.js";
const router = Router();

const questionsRepository = AppDataSource.getRepository(Question);
const questionsService = new QuestionsService(questionsRepository);
const answersRepository = AppDataSource.getRepository(Answer);
const answersService = new AnswersService(answersRepository);
const quizzesRepository = AppDataSource.getRepository(Quiz);
const usersRepository = AppDataSource.getRepository(User);
const quizzesService = new QuizzesService(quizzesRepository);
const usersService = new UsersService(usersRepository);
const settingsRepository = AppDataSource.getRepository(Settings);
const settingsService = new SettingsService(settingsRepository);
const resultsRepository = AppDataSource.getRepository(Result);
const resultsService = new ResultsService(resultsRepository);
const aiService = new Aiservice();
const quizzesTokensService = new TokensService(configuration.jwt.quiz.secret);
const parserService = new ParserService();

const quizzesController = new QuizzesController(
  quizzesService,
  usersService,
  questionsService,
  answersService,
  settingsService,
  resultsService,
  quizzesTokensService,
  aiService,
  parserService,
  logger,
);

router.post("/", authenticate, QuizValidator, async (req, res, next) => {
  await quizzesController.create(req, res, next);
});

router.post(
  "/generate",
  authenticate,
  QuizValidator,
  async (req, res, next) => {
    await quizzesController.generate(req, res, next);
  },
);

router.post("/improve", authenticate, QuizValidator, async (req, res, next) => {
  await quizzesController.improve(req, res, next);
});

router.post("/create-file", authenticate, async (req, res, next) => {
  await quizzesController.createFile(req, res, next);
});

router.get("/", authenticate, async (req, res, next) => {
  await quizzesController.findAll(req, res, next);
});

router.get("/:id", authenticate, async (req, res, next) => {
  await quizzesController.findOne(req, res, next);
});

router.put("/:id", authenticate, QuizValidator, async (req, res, next) => {
  await quizzesController.update(req, res, next);
});

router.delete("/:id", authenticate, async (req, res, next) => {
  await quizzesController.delete(req, res, next);
});

router.get("/:id/questions", authenticate, async (req, res, next) => {
  await quizzesController.findAllQuestions(req, res, next);
});

router.get(
  "/:id/questions/:questionId",
  authenticate,
  async (req, res, next) => {
    await quizzesController.findOneQuestion(req, res, next);
  },
);

router.post("/:id/questions", authenticate, async (req, res, next) => {
  await quizzesController.createQuestion(req, res, next);
});

router.put(
  "/:id/questions/:questionId",
  authenticate,
  async (req, res, next) => {
    await quizzesController.updateQuestion(req, res, next);
  },
);

router.delete(
  "/:id/questions/:questionId",
  authenticate,
  async (req, res, next) => {
    await quizzesController.deleteQuestion(req, res, next);
  },
);

router.get(
  "/:id/questions/:questionId/answers",
  authenticate,
  async (req, res, next) => {
    await quizzesController.findAllAnswers(req, res, next);
  },
);

router.get(
  "/:id/questions/:questionId/answers/:answerId",
  authenticate,
  async (req, res, next) => {
    await quizzesController.findOneAnswer(req, res, next);
  },
);

router.post(
  "/:id/questions/:questionId/answers",
  authenticate,
  async (req, res, next) => {
    await quizzesController.createAnswer(req, res, next);
  },
);

router.put(
  "/:id/questions/:questionId/answers/:answerId",
  authenticate,
  async (req, res, next) => {
    await quizzesController.updateAnswer(req, res, next);
  },
);

router.delete(
  "/:id/questions/:questionId/answers/:answerId",
  authenticate,
  async (req, res, next) => {
    await quizzesController.deleteAnswer(req, res, next);
  },
);

router.get("/:id/settings", authenticate, async (req, res, next) => {
  await quizzesController.findSettings(req, res, next);
});

router.put("/:id/settings", authenticate, async (req, res, next) => {
  await quizzesController.updateSettings(req, res, next);
});

router.put("/:id/results", authenticate, async (req, res, next) => {
  await quizzesController.findResults(req, res, next);
});

router.put("/:id/start", authenticate, async (req, res, next) => {
  await quizzesController.start(req, res, next);
});

export default router;
