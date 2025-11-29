import { Router } from "express";
import OptionsController from "@/controllers/options.controller.js";
import OptionsService from "@/services/options.service.js";
import QuestionsService from "@/services/questions.service.js";
import { AppDataSource } from "@/data-source.js";
import authenticate from "@/middlewares/authenticate.js";
import logger from "@/lib/logger.js";
import { OptionValidator } from "@/validators/options.validator.js";
import { Question } from "@/entities/question.js";
import { Option } from "@/entities/option.js";

const router = Router();

const optionsRepository = AppDataSource.getRepository(Option);
const questionsRepository = AppDataSource.getRepository(Question);
const optionsService = new OptionsService(optionsRepository);
const questionsService = new QuestionsService(questionsRepository);

const optionsController = new OptionsController(
  optionsService,
  questionsService,
  logger,
);

router.post("/", authenticate, OptionValidator, async (req, res, next) => {
  await optionsController.create(req, res, next);
});

router.get("/:questionId", authenticate, async (req, res, next) => {
  await optionsController.findAll(req, res, next);
});

router.get("/:questionId/:id", authenticate, async (req, res, next) => {
  await optionsController.findOne(req, res, next);
});

router.put("/:id", authenticate, OptionValidator, async (req, res, next) => {
  await optionsController.update(req, res, next);
});

router.delete("/:id", authenticate, async (req, res, next) => {
  await optionsController.delete(req, res, next);
});

export default router;
