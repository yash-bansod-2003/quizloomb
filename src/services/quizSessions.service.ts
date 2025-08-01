import { QuizSession } from "@/entities/QuizSession.js";
import {
      DeepPartial,
      DeleteResult,
      Repository,
      UpdateResult,
      SaveOptions,
      FindManyOptions,
      FindOneOptions,
      FindOptionsWhere,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";

class QuizSessionsService {
      constructor(private readonly quizSessionsRepository: Repository<QuizSession>) { }

      async create(createQuizSessionDto: DeepPartial<QuizSession>, options?: SaveOptions) {
            const quizSession = this.quizSessionsRepository.create(createQuizSessionDto);
            return await this.quizSessionsRepository.save(quizSession, options);
      }

      async findAll(options?: FindManyOptions<QuizSession>): Promise<QuizSession[]> {
            return await this.quizSessionsRepository.find(options);
      }

      async findOne(options: FindOneOptions<QuizSession>): Promise<QuizSession | null> {
            return await this.quizSessionsRepository.findOne(options);
      }

      async update(
            criteria: FindOptionsWhere<QuizSession>,
            updateQuizSessionDto: QueryDeepPartialEntity<QuizSession>,
      ): Promise<UpdateResult> {
            return await this.quizSessionsRepository.update(criteria, updateQuizSessionDto);
      }

      async delete(criteria: FindOptionsWhere<QuizSession>): Promise<DeleteResult> {
            return await this.quizSessionsRepository.delete(criteria);
      }
}

export default QuizSessionsService;
