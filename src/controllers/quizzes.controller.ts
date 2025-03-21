import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import QuizzesService from "@/services/quizzes.service.js";
import UsersService from "@/services/users.service.js";
import AiService from "@/services/ai.service.js";
import { CreateQuizDto, UpdateQuizDto } from "@/dto/quizzes.js";
import { AuthenticatedRequest } from "@/middlewares/authenticate.js";
import SettingsService from "@/services/settings.service.js";

class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly usersService: UsersService,
    private readonly settingsService: SettingsService,
    private readonly aiService: AiService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createQuizDto = req.body as CreateQuizDto;
      const userId = Number((req as AuthenticatedRequest).user.sub);
      const user = await this.usersService.findOne({ where: { id: userId } });

      if (!user) {
        this.logger.error(`User ${userId} not found in create quiz`);
        return next(createHttpError.NotFound());
      }

      this.logger.info(`Creating quiz for user ${userId}`);
      const quiz = await this.quizzesService.create({ ...createQuizDto, user });

      if (!quiz) {
        throw new Error("Quiz creation failed");
      }

      const settings = await this.settingsService.create({ quiz });

      if (!settings) {
        throw new Error("Settings creation failed");
      }

      return res.status(201).json(quiz);
    } catch (error) {
      this.logger.error(`Create quiz error: ${error}`);
      return next(createHttpError.InternalServerError());
    }
  }

  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const createQuizDto = req.body as CreateQuizDto;
      const userId = (req as AuthenticatedRequest).user.sub;
      const user = await this.usersService.findOne({
        where: { id: Number(userId) },
      });

      if (!user) {
        this.logger.error(`User ${userId} not found in generate quiz`);
        return next(createHttpError.NotFound());
      }

      this.logger.info(`Generating quiz for user ${userId}`);
      const quiz = await this.aiService.generateQuiz(createQuizDto);
      return res.status(200).json(quiz);
    } catch (error) {
      this.logger.error(`Generate quiz error: ${error}`);
      return next(createHttpError.InternalServerError());
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user.sub;
      const user = await this.usersService.findOne({
        where: { id: Number(userId) },
      });

      if (!user) {
        this.logger.error(`User ${userId} not found in findAll quizzes`);
        return next(createHttpError.NotFound());
      }

      this.logger.info(`Fetching all quizzes for user ${userId}`);
      const quizzes = await this.quizzesService.findAll({
        where: { user: { id: user.id } },
      });
      return res.json(quizzes);
    } catch (error) {
      this.logger.error(`Find all quizzes error: ${error}`);
      return next(createHttpError.InternalServerError());
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = Number(req.params.id);
      const userId = (req as AuthenticatedRequest).user.sub;
      const user = await this.usersService.findOne({
        where: { id: Number(userId) },
      });

      if (!user) {
        this.logger.error(`User ${userId} not found in findOne quiz`);
        return next(createHttpError.NotFound());
      }

      this.logger.info(`Fetching quiz ${quizId} for user ${userId}`);
      const quiz = await this.quizzesService.findOne({
        where: {
          id: quizId,
          user: { id: user.id },
        },
      });
      return res.json(quiz);
    } catch (error) {
      this.logger.error(`Find one quiz error: ${error}`);
      return next(createHttpError.InternalServerError());
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = Number(req.params.id);
      const userId = (req as AuthenticatedRequest).user.sub;
      const user = await this.usersService.findOne({
        where: { id: Number(userId) },
      });

      if (!user) {
        this.logger.error(`User ${userId} not found in update quiz`);
        return next(createHttpError.NotFound());
      }

      this.logger.info(`Updating quiz ${quizId} for user ${userId}`);
      const quiz = await this.quizzesService.update(
        { id: quizId, user: { id: user.id } },
        req.body as UpdateQuizDto,
      );
      return res.json(quiz);
    } catch (error) {
      this.logger.error(`Update quiz error: ${error}`);
      return next(createHttpError.InternalServerError());
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = Number(req.params.id);
      const userId = (req as AuthenticatedRequest).user.sub;
      const user = await this.usersService.findOne({
        where: { id: Number(userId) },
      });

      if (!user) {
        this.logger.error(`User ${userId} not found in delete quiz`);
        return next(createHttpError.NotFound());
      }

      this.logger.info(`Deleting quiz ${quizId} for user ${userId}`);
      const quiz = await this.quizzesService.delete({
        id: quizId,
        user: { id: user.id },
      });
      return res.json(quiz);
    } catch (error) {
      this.logger.error(`Delete quiz error: ${error}`);
      return next(createHttpError.InternalServerError());
    }
  }
}

export default QuizzesController;
