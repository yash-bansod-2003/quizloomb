import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import SubmissionsService from "@/services/submissions.service.js";
import { submissionValidationSchema } from "@/validators/submissions.validator.js";
import { z } from "zod";
import QuestionsService from "@/services/questions.service.js";
import QuizzesService from "@/services/quizzes.service.js";
import QuizSessionsService from "@/services/quizSessions.service.js";
import UserService from "@/services/users.service.js";
import OptionsService from "@/services/options.service.js";
import ResultsService from "@/services/results.service.js";
import { AuthenticatedQuizRequest } from "@/middlewares/authenticate-quiz.js";
import { QuizStatus } from "@/entities/quiz.js";

class SubmissionsController {
  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly usersService: UserService,
    private readonly quizzesService: QuizzesService,
    private readonly resultsService: ResultsService,
    private readonly quizSessionsService: QuizSessionsService,
    private readonly questionsService: QuestionsService,
    private readonly optionsService: OptionsService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { quizId, questionId, optionIds, text } = req.body as z.infer<
      typeof submissionValidationSchema
    >;

    const quiz = await this.quizzesService.findOne({ where: { id: quizId } });

    if (!quiz) {
      this.logger.error(`Quiz with id ${quizId} not found`);
      return next(createHttpError.NotFound("quiz not found"));
    }

    if (quiz.status !== QuizStatus.LIVE) {
      this.logger.error("Quiz is not live");
      return next(
        createHttpError.Forbidden("Quiz is not live or available at this time"),
      );
    }

    const match = (req as AuthenticatedQuizRequest).quiz;

    if (!match) {
      this.logger.error("Quiz token does not match");
      return next(createHttpError.Unauthorized("quiz token does not match"));
    }

    const question = await this.questionsService.findOne({
      where: { id: questionId },
      relations: {
        options: true,
      },
    });

    if (!question) {
      this.logger.error(`Question with id ${questionId} not found`);
      return next(createHttpError.NotFound("question not found"));
    }

    const result = await this.resultsService.findOne({
      where: { id: match.resultId, quiz: { id: quizId } },
    });

    if (!result) {
      this.logger.error(`Result with id ${match.resultId} not found`);
      return next(createHttpError.NotFound("result not found"));
    }

    const quizSession = await this.quizSessionsService.findOne({
      where: {
        id: match.sessionId,
        quiz: { id: quizId },
        result: { id: match.resultId },
      },
    });

    if (!quizSession) {
      this.logger.error(`Quiz session with id ${match.sessionId} not found`);
      return next(createHttpError.NotFound("quiz session not found"));
    }

    if (new Date() > match.expiry) {
      this.logger.error("Quiz has ended");
      return next(createHttpError.Forbidden("Quiz has ended"));
    }

    await this.quizSessionsService.update(
      { id: quizSession.id },
      {
        questions: quizSession.questions.filter((q) => q !== questionId),
      },
    );

    const submission = await this.submissionsService.findOne({
      where: {
        quiz: { id: quizId },
        question: { id: questionId },
        sessionId: match.sessionId,
      },
    });

    const options = optionIds?.reduce(
      (acc, optionId) => {
        const option = question.options.find((opt) => opt.id === optionId);
        if (option) {
          acc.push(option);
        }
        return acc;
      },
      [] as typeof question.options,
    );

    if (submission) {
      await this.submissionsService.update(
        { id: submission.id },
        {
          quiz,
          question,
          options: options.length ? options : null,
          sessionId: match.sessionId,
          text,
        },
      );
      this.logger.info(`Updated existing submission with id: ${submission.id}`);
      res.status(200).json(submission);
      return;
    }

    const createdSubmission = await this.submissionsService.create({
      quiz,
      question,
      options: options.length ? options : null,
      text,
      sessionId: match.sessionId,
      result: result,
    });

    this.logger.info(`Created new submission with id: ${createdSubmission.id}`);
    res.status(201).json({ id: createdSubmission.id });
    return;
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const submissions = await this.submissionsService.findAll(req.query);
      const response = {
        data: submissions,
        success: true,
      };
      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    const submissionId = req.params.id;
    const submission = await this.submissionsService.findOne({
      where: { id: submissionId },
    });
    if (!submission) {
      this.logger.error(`Submission with id ${req.params.id} not found`);
      return next(createHttpError.NotFound("submission not found"));
    }
    const response = {
      data: submission,
      success: true,
    };
    return res.json(response);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const submissionId = req.params.id;
    const submission = await this.submissionsService.delete({
      id: submissionId,
    });
    if (!submission) {
      this.logger.error(`Submission with id ${submissionId} not found`);
      return next(createHttpError.NotFound("submission not found"));
    }
    this.logger.info(`Deleted submission with id: ${submissionId}`);
    return res.json(submission);
  }
}

export default SubmissionsController;
