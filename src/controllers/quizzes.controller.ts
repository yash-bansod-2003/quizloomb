import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import createHttpError from "http-errors";

import QuizzesService from "@/services/quizzes.service.js";
import UsersService from "@/services/users.service.js";
import AiService from "@/services/ai.service.js";
import SettingsService from "@/services/settings.service.js";
import QuestionsService from "@/services/questions.service.js";
import AnswersService from "@/services/answers.service.js";
import TokensService from "@/services/tokens.service.js";
import ParserService from "@/services/parser.service.js";

import { quizValidationSchema } from "@/validators/quizzes.validator.js";
import { AuthenticatedRequest } from "@/middlewares/authenticate.js";

import { COOKIE_PROPERTIES } from "@/lib/constants.js";
import configuration from "@/lib/configuration.js";
import { QuizTokenPayload } from "@/types/index.js";

class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
    private readonly usersService: UsersService,
    private readonly questionsService: QuestionsService,
    private readonly answersService: AnswersService,
    private readonly settingsService: SettingsService,
    private readonly quizzesTokensService: TokensService,
    private readonly aiService: AiService,
    private readonly parserService: ParserService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createQuizDto = req.body as z.infer<typeof quizValidationSchema>;
      const userId = (req as AuthenticatedRequest).user.id;
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

  async improve(req: Request, res: Response, next: NextFunction) {
    try {
      const createQuizDto = req.body as z.infer<typeof quizValidationSchema>;
      const userId = (req as AuthenticatedRequest).user.id;
      const user = await this.usersService.findOne({
        where: { id: userId },
      });

      if (!user) {
        this.logger.error(`User ${userId} not found in generate quiz`);
        return next(createHttpError.NotFound());
      }

      if (user.credits < 2) {
        this.logger.error(`User ${userId} does not have enough credits`);
        return next(createHttpError.Forbidden("Not enough credits"));
      }

      this.logger.info(`Generating quiz for user ${userId}`);
      const quizContent = await this.aiService.improveQuiz(createQuizDto);
      await this.usersService.update(
        {
          id: userId,
        },
        {
          credits: user.credits - 2,
        },
      );
      return res.status(200).send(quizContent);
    } catch (error) {
      this.logger.error(`Generate quiz error: ${error}`);
      return next(createHttpError.InternalServerError());
    }
  }

  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const createQuizDto = req.body as z.infer<typeof quizValidationSchema>;
      const userId = (req as AuthenticatedRequest).user.id;
      const user = await this.usersService.findOne({
        where: { id: userId },
      });

      if (!user) {
        this.logger.error(`User ${userId} not found in generate quiz`);
        return next(createHttpError.NotFound());
      }

      if (user.credits < 2) {
        this.logger.error(`User ${userId} does not have enough credits`);
        return next(createHttpError.Forbidden("Not enough credits"));
      }

      this.logger.info(`Generating quiz for user ${userId}`);
      const quiz = await this.aiService.generateQuiz(createQuizDto);
      if (!quiz) {
        this.logger.error(`Quiz generation failed for user ${userId}`);
        return next(createHttpError.InternalServerError());
      }
      await this.usersService.update(
        {
          id: userId,
        },
        {
          credits: user.credits - 2,
        },
      );
      return res.status(200).json(quiz);
    } catch (error) {
      this.logger.error(`Generate quiz error: ${error}`);
      return next(createHttpError.InternalServerError());
    }
  }

  async createFile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user.id;
      const user = await this.usersService.findOne({
        where: { id: userId },
      });

      if (!user) {
        this.logger.error(`User ${userId} not found in generate quiz`);
        return next(createHttpError.NotFound());
      }

      if (user.credits < 1) {
        this.logger.error(`User ${userId} does not have enough credits`);
        return next(createHttpError.Forbidden("Not enough credits"));
      }

      this.logger.info(`Generating quiz from file for user ${userId}`);
      const content = (req.body as { content: string }).content;
      const result = this.parserService.parse(content);
      if (result.errors.length > 0) {
        res.status(400).json({
          status: "error",
          errors: result.errors,
        });
        return;
      }

      const quiz = await this.quizzesService.create({
        title: result.quiz.title,
        description: result.quiz.description,
        user,
      });

      for (const question of result.quiz.questions) {
        const dbQuestion = await this.questionsService.create({
          text: question.question,
          type: question.type,
          tags: question.tags,
          quiz,
        });
        if (!dbQuestion) {
          this.logger.error("Failed to create question");
          return next(createHttpError.InternalServerError());
        }

        if (question.type === "mcq") {
          for (const option of question.options) {
            const answer = await this.answersService.create({
              text: option,
              question: dbQuestion,
              isCorrect: question.correct === option,
            });
            if (!answer) {
              this.logger.error("Failed to create answer");
              return next(createHttpError.InternalServerError());
            }
          }
        }

        if (question.type === "multi_select") {
          for (const option of question.options) {
            const answer = await this.answersService.create({
              text: option,
              question: dbQuestion,
              isCorrect: (question.correct as string[]).includes(option),
            });
            if (!answer) {
              this.logger.error("Failed to create answer");
              return next(createHttpError.InternalServerError());
            }
          }
        }
      }
      await this.usersService.update(
        {
          id: userId,
        },
        {
          credits: user.credits - 1,
        },
      );
      res.status(201).json({ status: "ok" });
      return;
    } catch (error) {
      this.logger.error(`Generate quiz error: ${error}`);
      return next(createHttpError.InternalServerError());
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AuthenticatedRequest).user.id;
      const user = await this.usersService.findOne({
        where: { id: userId },
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
      const quizId = req.params.id;
      const userId = (req as AuthenticatedRequest).user.id;
      const user = await this.usersService.findOne({
        where: { id: userId },
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
      const quizId = req.params.id;
      const userId = (req as AuthenticatedRequest).user.id;
      const updateQuizDto = req.body as z.infer<typeof quizValidationSchema>;
      const user = await this.usersService.findOne({
        where: { id: userId },
      });

      if (!user) {
        this.logger.error(`User ${userId} not found in update quiz`);
        return next(createHttpError.NotFound());
      }

      this.logger.info(`Updating quiz ${quizId} for user ${userId}`);
      const quiz = await this.quizzesService.update(
        { id: quizId, user: { id: user.id } },
        updateQuizDto,
      );
      return res.json(quiz);
    } catch (error) {
      this.logger.error(`Update quiz error: ${error}`);
      return next(createHttpError.InternalServerError());
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      const userId = (req as AuthenticatedRequest).user.id;
      const user = await this.usersService.findOne({
        where: { id: userId },
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

  async start(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: quizId } = req.body as { id: string };
      const userId = (req as AuthenticatedRequest).user.id;
      const user = await this.usersService.findOne({
        where: { id: userId },
      });

      if (!user) {
        this.logger.error(`User ${userId} not found in findSettings`);
        return next(createHttpError.NotFound());
      }

      const quiz = await this.quizzesService.findOne({
        where: {
          id: quizId,
          user: { id: user.id },
        },
      });

      if (!quiz) {
        this.logger.error(`Quiz ${quizId} not found for user ${userId}`);
        return next(createHttpError.NotFound());
      }

      this.logger.info(`Fetching settings for quiz ${quizId}`);
      const settings = await this.settingsService.findOne({
        where: { quiz: { id: quizId } },
      });

      if (!settings) {
        this.logger.error(`Settings not found for quiz ${quizId}`);
        return next(createHttpError.NotFound());
      }

      const { startTime, endTime, durationMinutes } = settings;
      const currentTime = new Date();
      if (currentTime < startTime || currentTime > endTime) {
        this.logger.error(`Quiz ${quizId} is not available at this time`);
        return next(
          createHttpError.Forbidden("Quiz is not available at this time"),
        );
      }

      const sessionId = uuidv4();

      const payload: QuizTokenPayload = {
        id: quiz.id,
        durationMinutes,
        startTime: currentTime,
        sessionId,
        user: {
          id: user.id,
          email: user.email,
        },
      };

      const quizToken = this.quizzesTokensService.sign(payload, {
        expiresIn: `${durationMinutes + 15}m`,
      });

      res.cookie(COOKIE_PROPERTIES.QUIZ_TOKEN_COOKIE_NAME, quizToken, {
        httpOnly: COOKIE_PROPERTIES.HTTP_ONLY,
        sameSite: COOKIE_PROPERTIES.SAME_SITE,
        maxAge: (durationMinutes + 15) * 60 * 1000,
        secure: COOKIE_PROPERTIES.SECURE,
        ...(configuration.node_env === "production" && {
          domain: COOKIE_PROPERTIES.DOMAIN,
        }),
      });

      return res.json({ id: quizId });
    } catch (error) {
      this.logger.error(`Find settings error: ${error}`);
      return next(createHttpError.InternalServerError());
    }
  }
}

export default QuizzesController;
