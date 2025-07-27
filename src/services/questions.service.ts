import { Question } from "@/entities/Question.js";
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
  constructor(private readonly usersRepository: Repository<Question>) {}

  async create(
    createQuestionDto: DeepPartial<Question>,
    options?: SaveOptions,
  ) {
    const result = this.usersRepository.create(createQuestionDto);
    return await this.usersRepository.save(result, options);
  }

  async findAll(options?: FindManyOptions<Question>): Promise<Question[]> {
    return this.usersRepository.find(options);
  }

  async findTags(): Promise<string[]> {
    const questions = await this.usersRepository.find({
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
    return this.usersRepository.findOne(options);
  }

  async update(
    options: FindOptionsWhere<Question>,
    updateQuestionDto: QueryDeepPartialEntity<Question>,
  ): Promise<UpdateResult> {
    return this.usersRepository.update(options, updateQuestionDto);
  }

  async delete(criteria: FindOptionsWhere<Question>): Promise<DeleteResult> {
    return this.usersRepository.delete(criteria);
  }
}

export default QuestionsService;
