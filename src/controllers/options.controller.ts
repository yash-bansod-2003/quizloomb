import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Logger } from "winston";
import createHttpError from "http-errors";
import OptionsService from "@/services/options.service.js";
import { optionValidationSchema } from "@/validators/options.validator.js";
import QuestionsService from "@/services/questions.service.js";

class OptionsController {
  constructor(
    private readonly optionsService: OptionsService,
    private readonly questionsService: QuestionsService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    this.logger.debug("creating option");
    const { questionId, ...rest } = req.body as z.infer<
      typeof optionValidationSchema
    >;
    try {
      const question = await this.questionsService.findOne({
        where: { id: questionId },
      });

      if (!question) {
        this.logger.error("question not found");
        throw createHttpError.NotFound("question not found");
      }

      const option = await this.optionsService.create({ ...rest, question });

      if (!option) {
        this.logger.error("option not created");
        throw createHttpError.InternalServerError("option not created");
      }

      this.logger.debug("option created");
      res.status(201).json(option);
    } catch (error) {
      this.logger.error(`error creating option: ${error}`);
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    this.logger.debug("finding all options");
    try {
      const questionId = req.params.questionId;
      const options = await this.optionsService.findAll({
        where: {
          question: { id: questionId },
          ...req.query,
        },
        select: {
          id: true,
          text: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      this.logger.debug("options found");
      res.json(options);
    } catch (error) {
      this.logger.error(`error finding all options: ${error}`);
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    this.logger.debug("finding option");
    try {
      const questionId = req.params.questionId;
      const option = await this.optionsService.findOne({
        where: {
          id: req.params.id,
          question: { id: questionId },
        },
        select: {
          id: true,
          text: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!option) {
        this.logger.error("option not found");
        throw createHttpError.NotFound("option not found");
      }
      this.logger.debug("option found");
      res.json(option);
    } catch (error) {
      this.logger.error(`error finding option: ${error}`);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    this.logger.debug("updating option");
    const { questionId, text, isCorrect } = req.body as z.infer<
      typeof optionValidationSchema
    >;
    try {
      const option = await this.optionsService.update(
        { id: req.params.id, question: { id: questionId } },
        { text, isCorrect },
      );
      if (!option) {
        this.logger.error("option not updated");
        throw createHttpError.InternalServerError("option not updated");
      }
      this.logger.debug("option updated");

      const updatedOption = await this.optionsService.findOne({
        where: { id: req.params.id },
      });

      res.json(updatedOption);
    } catch (error) {
      this.logger.error(`error updating option: ${error}`);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    this.logger.debug("deleting option");
    try {
      const option = await this.optionsService.delete({
        id: req.params.id,
      });
      if (!option) {
        this.logger.error("option not deleted");
        throw createHttpError.InternalServerError("option not deleted");
      }
      this.logger.debug("option deleted");
      res.json(option);
    } catch (error) {
      this.logger.error(`error deleting option: ${error}`);
      next(error);
    }
  }
}

export default OptionsController;
