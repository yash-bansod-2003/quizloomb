import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import { Logger } from "winston";

import SettingsService from "@/services/settings.service.js";
import { settingsCreateValidationSchema } from "@/validators/settings.validator.js";

class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly logger: Logger,
  ) {}

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.info("Fetching all settings");
      const settings = await this.settingsService.findAll();
      if (!settings) {
        this.logger.error("Failed to obtain settings");
        throw createHttpError.InternalServerError("Failed to obtain settings");
      }
      return res.json(settings);
    } catch (error) {
      this.logger.error(`Error fetching all settings: ${error}`);
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const settingId = Number(req.params.id);
      this.logger.info(`Fetching setting with id: ${settingId}`);
      const setting = await this.settingsService.findOne({
        where: { id: settingId },
      });

      if (!setting) {
        this.logger.error(`Setting with id ${settingId} not found`);
        throw createHttpError.NotFound("Setting not found");
      }

      return res.json(setting);
    } catch (error) {
      this.logger.error(
        `Error fetching setting with id ${req.params.id}: ${error}`,
      );
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const settingId = Number(req.params.id);
      const settingUpdateData = req.body as z.infer<
        typeof settingsCreateValidationSchema
      >;

      this.logger.info(
        `Updating setting with id: ${settingId} with data: ${JSON.stringify(req.body)}`,
      );

      const updatedSetting = await this.settingsService.update(
        { id: settingId },
        settingUpdateData,
      );

      if (!updatedSetting) {
        this.logger.error(`Failed to update setting with id ${settingId}`);
        throw createHttpError.InternalServerError("Setting not updated");
      }

      this.logger.info(`Updated setting with id: ${settingId}`);
      return res.json(updatedSetting);
    } catch (error) {
      this.logger.error(
        `Error updating setting with id ${req.params.id}: ${error}`,
      );
      next(error);
    }
  }
}

export default SettingsController;
