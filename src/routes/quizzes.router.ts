import { Router } from "express";
import QuizzesController from "@/controllers/quizzes.controller.js";
import QuizzesService from "@/services/quizzes.service.js";
import UsersService from "@/services/users.service.js";
import { AppDataSource } from "@/data-source.js";
import { Quiz } from "@/models/Quiz.js";
import authenticate from "@/middlewares/authenticate.js";
import logger from "@/config/logger.js";
import { QuizValidator } from "@/validators/quizzes.validator.js";
import { User } from "@/models/User.js";
import Aiservice from "@/services/ai.service.js";
import SettingsService from "@/services/settings.service.js";
import { Settings } from "@/models/Settings.js";

const router = Router();

const quizzesRepository = AppDataSource.getRepository(Quiz);
const usersRepository = AppDataSource.getRepository(User);
const quizzesService = new QuizzesService(quizzesRepository);
const usersService = new UsersService(usersRepository);
const settingsRepository = AppDataSource.getRepository(Settings);
const settingsService = new SettingsService(settingsRepository);
const aiService = new Aiservice();

const quizzesController = new QuizzesController(
  quizzesService,
  usersService,
  settingsService,
  aiService,
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

export default router;
