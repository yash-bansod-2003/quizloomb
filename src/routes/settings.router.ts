import { Router } from "express";
import SettingsController from "@/controllers/settings.controller.js";
import SettingsService from "@/services/settings.service.js";
import { AppDataSource } from "@/data-source.js";
import authenticate from "@/middlewares/authenticate.js";
import logger from "@/lib/logger.js";
import { SettingsValidator } from "@/validators/settings.validator.js";
import { Settings } from "@/entities/Settings.js";

const router = Router();

const settingsRepository = AppDataSource.getRepository(Settings);
const settingsService = new SettingsService(settingsRepository);

const settingsController = new SettingsController(settingsService, logger);

router.get("/", authenticate, async (req, res, next) => {
  await settingsController.findAll(req, res, next);
});

router.get("/:id", authenticate, async (req, res, next) => {
  await settingsController.findOne(req, res, next);
});

router.put("/:id", authenticate, SettingsValidator, async (req, res, next) => {
  await settingsController.update(req, res, next);
});

export default router;
