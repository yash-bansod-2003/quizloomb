import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import SubmissionsService from "@/services/submissions.service.js";
import { submissionValidationSchema } from "@/validators/submissions.validator.js";
import { z } from "zod";
import QuestionsService from "@/services/questions.service.js";
import QuizzesService from "@/services/quizzes.service.js";
import UserService from "@/services/users.service.js";
import AnswersService from "@/services/answers.service.js";
import { AuthenticatedRequest } from "@/middlewares/authenticate.js";
import TokensService from "@/services/tokens.service.js";
import { AuthenticatedQuizRequest } from "@/middlewares/authenticate-quiz.js";
import { QuizStatus } from "@/entities/Quiz.js";

class SubmissionsController {
  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly usersService: UserService,
    private readonly quizzesService: QuizzesService,
    private readonly quizzesTokensService: TokensService,
    private readonly questionsService: QuestionsService,
    private readonly answersService: AnswersService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const userId = (req as AuthenticatedRequest).user.id;
    const user = await this.usersService.findOne({
      where: { id: userId },
    });

    if (!user) {
      this.logger.error(`User with id ${userId} not found`);
      return next(createHttpError.NotFound("user not found"));
    }
    const { quizId, questionId, answerId } = req.body as z.infer<
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

    const quizEndTime = new Date(
      match.startTime.getTime() + match.durationMinutes * 60 * 1000,
    );

    if (new Date() > quizEndTime) {
      this.logger.error("Quiz has ended");
      return next(createHttpError.Forbidden("Quiz has ended"));
    }

    const question = await this.questionsService.findOne({
      where: { id: questionId },
    });

    if (!question) {
      this.logger.error(`Question with id ${questionId} not found`);
      return next(createHttpError.NotFound("question not found"));
    }

    const answer = await this.answersService.findOne({
      where: { id: answerId },
    });

    if (!answer) {
      this.logger.error(`Answer with id ${answerId} not found`);
      return next(createHttpError.NotFound("answer not found"));
    }

    const submission = await this.submissionsService.findOne({
      where: {
        quiz: { id: quizId },
        question: { id: questionId },
        answer: { id: answerId },
        sessionId: match.sessionId,
      },
    });

    if (submission) {
      await this.submissionsService.update(
        { id: submission.id },
        {
          quiz,
          question,
          answer,
          sessionId: match.sessionId,
        },
      );
      this.logger.info(`Updated existing submission with id: ${submission.id}`);
      res.status(200).json(submission);
      return;
    }

    await this.submissionsService.create({
      quiz,
      question,
      answer,
      sessionId: match.sessionId,
    });

    this.logger.info(`Created new submission with id: ${submission.id}`);
    res.status(201).json(submission);
    return;
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const submissions = await this.submissionsService.findAll(req.query);
      return res.json(submissions);
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
    return res.json(submission);
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
