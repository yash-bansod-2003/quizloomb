import { Router } from "express";
import QuestionsController from "@/controllers/questions.controller.js";
import QuestionsService from "@/services/questions.service.js";
import QuizzesService from "@/services/quizzes.service.js";
import AnswersService from "@/services/answers.service.js";
import { AppDataSource } from "@/data-source.js";
import authenticate from "@/middlewares/authenticate.js";
import logger from "@/lib/logger.js";
import { QuestionValidator } from "@/validators/questions.validator.js";
import { AnswerValidator } from "@/validators/answers.validator.js";
import { Quiz } from "@/entities/Quiz.js";
import { Question } from "@/entities/Question.js";
import { Answer } from "@/entities/Answer.js";

const router = Router();

const questionsRepository = AppDataSource.getRepository(Question);
const quizzesRepository = AppDataSource.getRepository(Quiz);
const answersRepository = AppDataSource.getRepository(Answer);
const questionsService = new QuestionsService(questionsRepository);
const quizzesService = new QuizzesService(quizzesRepository);
const answersService = new AnswersService(answersRepository);

const questionsController = new QuestionsController(
  questionsService,
  quizzesService,
  answersService,
  logger,
);

router.post("/", authenticate, QuestionValidator, async (req, res, next) => {
  await questionsController.create(req, res, next);
});

router.get("/", authenticate, async (req, res, next) => {
  await questionsController.findAll(req, res, next);
});

router.get("/:id", authenticate, async (req, res, next) => {
  await questionsController.findOne(req, res, next);
});

router.put("/:id", authenticate, QuestionValidator, async (req, res, next) => {
  await questionsController.update(req, res, next);
});

router.delete("/:id", authenticate, async (req, res, next) => {
  await questionsController.delete(req, res, next);
});

router.get("/:id/answers", authenticate, async (req, res, next) => {
  await questionsController.findAllAnswers(req, res, next);
});

router.post(
  "/:id/answers",
  authenticate,
  AnswerValidator,
  async (req, res, next) => {
    await questionsController.createAnswer(req, res, next);
  },
);

router.get("/:id/answers/:answerId", authenticate, async (req, res, next) => {
  await questionsController.findOneAnswer(req, res, next);
});

router.put(
  "/:id/answers/:answerId",
  authenticate,
  AnswerValidator,
  async (req, res, next) => {
    await questionsController.updateAnswer(req, res, next);
  },
);

router.delete(
  "/:id/answers/:answerId",
  authenticate,
  async (req, res, next) => {
    await questionsController.deleteAnswer(req, res, next);
  },
);

export default router;
