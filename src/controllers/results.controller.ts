import { NextFunction, Request, Response } from "express";
import { Logger } from "winston";
import createHttpError from "http-errors";
import ResultsService from "@/services/results.service.js";
import { resultValidationSchema } from "@/validators/results.validator.js";
import QuizzesService from "@/services/quizzes.service.js";
import UserService from "@/services/users.service.js";
import { AuthenticatedRequest } from "@/middlewares/authenticate.js";
import SubmissionsService from "@/services/submissions.service.js";
import { z } from "zod";

class ResultsController {
  constructor(
    private readonly resultsService: ResultsService,
    private readonly usersService: UserService,
    private readonly quizzesService: QuizzesService,
    private readonly submissionsService: SubmissionsService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    this.logger.info("Entered create function for new result");
    this.logger.debug(`Received request body: ${JSON.stringify(req.body)}`);

    try {
      const userId = (req as AuthenticatedRequest).user.id;
      this.logger.debug(`Fetching user with id: ${userId}`);

      const user = await this.usersService.findOne({
        where: { id: userId },
      });

      if (!user) {
        const err = createHttpError.NotFound("user not found");
        this.logger.error(`User not found with id: ${userId}`);
        throw err;
      }

      const { quizId } = req.body as z.infer<typeof resultValidationSchema>;
      this.logger.debug(`Fetching quiz with id: ${quizId}`);

      const quiz = await this.quizzesService.findOne({ where: { id: quizId } });
      if (!quiz) {
        const err = createHttpError.NotFound("quiz not found");
        this.logger.error(`Quiz not found with id: ${quizId}`);
        throw err;
      }

      this.logger.debug(
        `Fetching submissions for user id ${user.id} and quiz id ${quiz.id}`,
      );
      const submissions = await this.submissionsService.findAll({
        where: {
          user: { id: user.id },
          quiz: { id: quiz.id },
        },
      });
      if (!submissions || submissions.length === 0) {
        const err = createHttpError.NotFound("submissions not found");
        this.logger.error(
          `No submissions found for user id ${user.id} in quiz id ${quiz.id}`,
        );
        throw err;
      }

      // Calculate score.
      const score = submissions.reduce((acc, submission) => {
        return acc + (submission.answer.isCorrect ? 1 : 0);
      }, 0);
      this.logger.info(`Calculated score: ${score}`);

      const previousResults = await this.resultsService.findAll({
        where: {
          user: { id: user.id },
          quiz: { id: quiz.id },
        },
      });
      const attempt = previousResults.length + 1;
      this.logger.debug(`User attempt number: ${attempt}`);

      // Create result.
      this.logger.info(
        `Creating result for user id ${user.id} with quiz id ${quiz.id}`,
      );
      const newResult = await this.resultsService.create({
        user,
        quiz,
        score,
        attempt,
      });
      this.logger.info(
        `Successfully created result with id: ${newResult.id || "unknown"}`,
      );
      res.status(201).json(newResult);
    } catch (error) {
      this.logger.error(`Error in create function: ${error}`);
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    this.logger.info("Entered findAll function for results");
    try {
      const results = await this.resultsService.findAll();
      this.logger.info(`Returned ${results.length} results`);
      res.json(results);
    } catch (error) {
      this.logger.error(`Error in findAll: ${error}`);
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    const resultId = req.params.id;
    this.logger.info(`Entered findOne for result id: ${resultId}`);
    try {
      const result = await this.resultsService.findOne({
        where: { id: resultId },
      });
      if (!result) {
        const err = createHttpError.NotFound("result not found");
        this.logger.error(`Result not found with id: ${resultId}`);
        throw err;
      }
      this.logger.info(`Successfully fetched result with id: ${resultId}`);
      res.json(result);
    } catch (error) {
      this.logger.error(`Error in findOne for id ${resultId}: ${error}`);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const resultId = req.params.id;
    this.logger.info(`Entered delete for result id: ${resultId}`);
    try {
      const result = await this.resultsService.delete({
        id: resultId,
      });
      if (!result) {
        const err = createHttpError.NotFound("result not found");
        this.logger.error(`Result not found with id: ${resultId}`);
        throw err;
      }
      this.logger.info(`Successfully deleted result with id: ${resultId}`);
      res.json(result);
    } catch (error) {
      this.logger.error(`Error in delete for id ${resultId}: ${error}`);
      next(error);
    }
  }
}

export default ResultsController;
