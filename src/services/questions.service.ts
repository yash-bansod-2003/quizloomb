import { Question } from "@/entities/question.js";
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

class QuestionsService {
  constructor(private readonly questionsRepository: Repository<Question>) {}

  async create(
    createQuestionDto: DeepPartial<Question>,
    options?: SaveOptions,
  ) {
    const result = this.questionsRepository.create(createQuestionDto);
    return await this.questionsRepository.save(result, options);
  }

  async findAll(options?: FindManyOptions<Question>): Promise<Question[]> {
    return this.questionsRepository.find(options);
  }

  async findTags(): Promise<string[]> {
    const questions = await this.questionsRepository.find({
      select: ["tags"],
    });
    const tags = Array.from(
      new Set(
        questions.flatMap((q) => q.tags).map((tag) => tag.trim().toLowerCase()),
      ),
    );
    return tags;
  }

  async findOne(options: FindOneOptions<Question>): Promise<Question | null> {
    return this.questionsRepository.findOne(options);
  }

  async update(
    options: FindOptionsWhere<Question>,
    updateQuestionDto: QueryDeepPartialEntity<Question>,
  ): Promise<UpdateResult> {
    return this.questionsRepository.update(options, updateQuestionDto);
  }

  async delete(criteria: FindOptionsWhere<Question>): Promise<DeleteResult> {
    return this.questionsRepository.delete(criteria);
  }
}

export default QuestionsService;
