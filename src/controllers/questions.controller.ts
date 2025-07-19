import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Logger } from "winston";
import QuestionsService from "@/services/questions.service.js";
import createHttpError from "http-errors";
import QuizzesService from "@/services/quizzes.service.js";
import AnswersService from "@/services/answers.service.js";
import { questionValidationSchema } from "@/validators/questions.validator.js";
import { answerValidationSchema } from "@/validators/answers.validator.js";

class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly quizzesService: QuizzesService,
    private readonly answersService: AnswersService,
    private readonly logger: Logger,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.info(
        `Creating new question with data: ${JSON.stringify(req.body)}`,
      );
      const { quizId, ...questionData } = req.body as z.infer<
        typeof questionValidationSchema
      >;
      const quiz = await this.quizzesService.findOne({ where: { id: quizId } });

      if (!quiz) {
        this.logger.error(`Quiz with id ${quizId} not found`);
        throw createHttpError.NotFound("Quiz not found");
      }

      const question = await this.questionsService.create({
        ...questionData,
        quiz,
      });
      if (!question) {
        this.logger.error("Failed to create question");
        throw createHttpError.InternalServerError("Question not created");
      }

      this.logger.info(`Created new question with id: ${question.id}`);
      return res.status(201).json(question);
    } catch (error) {
      this.logger.error(`Error creating question: ${error}`);
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.info("Fetching all questions");
      const questions = await this.questionsService.findAll();
      if (!questions) {
        this.logger.error("Failed to obtain questions");
        throw createHttpError.InternalServerError("Failed to obtain questions");
      }
      return res.json(questions);
    } catch (error) {
      this.logger.error(`Error fetching all questions: ${error}`);
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      this.logger.info(`Fetching question with id: ${questionId}`);
      const question = await this.questionsService.findOne({
        where: { id: questionId },
        relations: {
          answers: true,
        },
      });

      if (!question) {
        this.logger.error(`Question with id ${questionId} not found`);
        throw createHttpError.NotFound("Question not found");
      }

      return res.json(question);
    } catch (error) {
      this.logger.error(
        `Error fetching question with id ${req.params.id}: ${error}`,
      );
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      const updateQuestionDto = req.body as z.infer<
        typeof questionValidationSchema
      >;

      this.logger.info(
        `Updating question with id: ${questionId} with data: ${JSON.stringify(req.body)}`,
      );
      const updatedQuestion = await this.questionsService.update(
        { id: questionId },
        updateQuestionDto,
      );

      if (!updatedQuestion) {
        this.logger.error(`Failed to update question with id ${questionId}`);
        throw createHttpError.InternalServerError("Question not updated");
      }

      this.logger.info(`Updated question with id: ${questionId}`);
      return res.json(updatedQuestion);
    } catch (error) {
      this.logger.error(
        `Error updating question with id ${req.params.id}: ${error}`,
      );
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      this.logger.info(`Deleting question with id: ${questionId}`);
      const deletedQuestion = await this.questionsService.delete({
        id: questionId,
      });

      if (!deletedQuestion) {
        this.logger.error(`Failed to delete question with id ${questionId}`);
        throw createHttpError.InternalServerError("Question not deleted");
      }

      this.logger.info(`Deleted question with id: ${questionId}`);
      return res.json(deletedQuestion);
    } catch (error) {
      this.logger.error(
        `Error deleting question with id ${req.params.id}: ${error}`,
      );
      next(error);
    }
  }

  // New methods for answer management

  async findAllAnswers(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      this.logger.info(
        `Fetching all answers for question with id: ${questionId}`,
      );

      // First check if question exists
      const question = await this.questionsService.findOne({
        where: { id: questionId },
      });

      if (!question) {
        this.logger.error(`Question with id ${questionId} not found`);
        throw createHttpError.NotFound("Question not found");
      }

      const answers = await this.answersService.findAll({
        where: { question: { id: questionId } },
      });

      if (!answers) {
        this.logger.error(
          `Failed to obtain answers for question with id ${questionId}`,
        );
        throw createHttpError.InternalServerError("Failed to obtain answers");
      }

      return res.json(answers);
    } catch (error) {
      this.logger.error(`Error fetching answers for question: ${error}`);
      next(error);
    }
  }

  async createAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      this.logger.info(
        `Creating new answer for question with id: ${questionId} with data: ${JSON.stringify(req.body)}`,
      );

      // First check if question exists
      const question = await this.questionsService.findOne({
        where: { id: questionId },
      });

      if (!question) {
        this.logger.error(`Question with id ${questionId} not found`);
        throw createHttpError.NotFound("Question not found");
      }

      const answerData = req.body as z.infer<typeof answerValidationSchema>;
      const answer = await this.answersService.create({
        ...answerData,
        question,
      });

      if (!answer) {
        this.logger.error(
          `Failed to create answer for question with id ${questionId}`,
        );
        throw createHttpError.InternalServerError("Answer not created");
      }

      this.logger.info(
        `Created new answer with id: ${answer.id} for question with id: ${questionId}`,
      );
      return res.status(201).json(answer);
    } catch (error) {
      this.logger.error(`Error creating answer for question: ${error}`);
      next(error);
    }
  }

  async findOneAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      const answerId = req.params.answerId;
      this.logger.info(
        `Fetching answer with id: ${answerId} for question with id: ${questionId}`,
      );

      const question = await this.questionsService.findOne({
        where: { id: questionId },
      });

      if (!question) {
        this.logger.error(`Question with id ${questionId} not found`);
        throw createHttpError.NotFound("Question not found");
      }

      const answer = await this.answersService.findOne({
        where: { id: answerId, question: { id: questionId } },
      });

      if (!answer) {
        this.logger.error(
          `Answer with id ${answerId} not found for question with id ${questionId}`,
        );
        throw createHttpError.NotFound("Answer not found");
      }

      return res.json(answer);
    } catch (error) {
      this.logger.error(
        `Error fetching answer with id ${req.params.answerId} for question with id ${req.params.id}: ${error}`,
      );
      next(error);
    }
  }

  async updateAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      const answerId = req.params.answerId;
      const updateAnswerDto = req.body as z.infer<
        typeof answerValidationSchema
      >;

      this.logger.info(
        `Updating answer with id: ${answerId} for question with id: ${questionId} with data: ${JSON.stringify(req.body)}`,
      );

      // First check if question exists
      const question = await this.questionsService.findOne({
        where: { id: questionId },
      });

      if (!question) {
        this.logger.error(`Question with id ${questionId} not found`);
        throw createHttpError.NotFound("Question not found");
      }

      const existingAnswer = await this.answersService.findOne({
        where: { id: answerId, question: { id: questionId } },
      });

      if (!existingAnswer) {
        this.logger.error(
          `Answer with id ${answerId} not found for question with id ${questionId}`,
        );
        throw createHttpError.NotFound("Answer not found");
      }

      const updatedAnswer = await this.answersService.update(
        { id: answerId },
        updateAnswerDto,
      );

      if (!updatedAnswer) {
        this.logger.error(`Failed to update answer with id ${answerId}`);
        throw createHttpError.InternalServerError("Answer not updated");
      }

      this.logger.info(
        `Updated answer with id: ${answerId} for question with id: ${questionId}`,
      );
      return res.json(updatedAnswer);
    } catch (error) {
      this.logger.error(
        `Error updating answer with id ${req.params.answerId} for question with id ${req.params.id}: ${error}`,
      );
      next(error);
    }
  }

  async deleteAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.id;
      const answerId = req.params.answerId;
      this.logger.info(
        `Deleting answer with id: ${answerId} for question with id: ${questionId}`,
      );

      // First check if question exists
      const question = await this.questionsService.findOne({
        where: { id: questionId },
      });

      if (!question) {
        this.logger.error(`Question with id ${questionId} not found`);
        throw createHttpError.NotFound("Question not found");
      }

      // Check if answer exists and belongs to the question
      const existingAnswer = await this.answersService.findOne({
        where: { id: answerId, question: { id: questionId } },
      });

      if (!existingAnswer) {
        this.logger.error(
          `Answer with id ${answerId} not found for question with id ${questionId}`,
        );
        throw createHttpError.NotFound("Answer not found");
      }

      const deletedAnswer = await this.answersService.delete({ id: answerId });

      if (!deletedAnswer) {
        this.logger.error(`Failed to delete answer with id ${answerId}`);
        throw createHttpError.InternalServerError("Answer not deleted");
      }

      this.logger.info(
        `Deleted answer with id: ${answerId} for question with id: ${questionId}`,
      );
      return res.json(deletedAnswer);
    } catch (error) {
      this.logger.error(
        `Error deleting answer with id ${req.params.answerId} for question with id ${req.params.id}: ${error}`,
      );
      next(error);
    }
  }
}

export default QuestionsController;
