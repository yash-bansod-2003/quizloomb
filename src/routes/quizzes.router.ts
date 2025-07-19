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
const aiService = new Aiservice();
const quizzesTokensService = new TokensService(configuration.jwt.quiz.secret);
const parserService = new ParserService();

const quizzesController = new QuizzesController(
  quizzesService,
  usersService,
  questionsService,
  answersService,
  settingsService,
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

router.post("/start", authenticate, async (req, res, next) => {
  await quizzesController.start(req, res, next);
});

export default router;
