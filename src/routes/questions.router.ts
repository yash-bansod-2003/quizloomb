import { Router } from "express";
import QuestionsController from "@/controllers/questions.controller.js";
import QuestionsService from "@/services/questions.service.js";
import QuizzesService from "@/services/quizzes.service.js";
import OptionsService from "@/services/options.service.js";
import { AppDataSource } from "@/data-source.js";
import authenticate from "@/middlewares/authenticate.js";
import logger from "@/lib/logger.js";
import { QuestionValidator } from "@/validators/questions.validator.js";
import { Quiz } from "@/entities/Quiz.js";
import { Question } from "@/entities/Question.js";
import { Option } from "@/entities/Option.js";

const router = Router();

const questionsRepository = AppDataSource.getRepository(Question);
const quizzesRepository = AppDataSource.getRepository(Quiz);
const optionsRepository = AppDataSource.getRepository(Option);
const questionsService = new QuestionsService(questionsRepository);
const quizzesService = new QuizzesService(quizzesRepository);
const optionsService = new OptionsService(optionsRepository);

const questionsController = new QuestionsController(
  questionsService,
  quizzesService,
  optionsService,
  logger,
);

router.post("/", authenticate, QuestionValidator, async (req, res, next) => {
  await questionsController.create(req, res, next);
});

router.get("/:quizId", authenticate, async (req, res, next) => {
  await questionsController.findAll(req, res, next);
});

router.get("/:quizId/:id", authenticate, async (req, res, next) => {
  await questionsController.findOne(req, res, next);
});

router.put(
  "/:quizId/:id",
  authenticate,
  QuestionValidator,
  async (req, res, next) => {
    await questionsController.update(req, res, next);
  },
);

router.delete("/:quizId/:id", authenticate, async (req, res, next) => {
  await questionsController.delete(req, res, next);
});

export default router;
