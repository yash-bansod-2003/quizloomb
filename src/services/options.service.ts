import { Option } from "@/entities/option.js";
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SaveOptions,
  UpdateResult,
  FindOptionsWhere,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";

class OptionsService {
  constructor(private readonly optionsRepository: Repository<Option>) {}

  async create(createOptionDto: DeepPartial<Option>, options?: SaveOptions) {
    const result = this.optionsRepository.create(createOptionDto);
    return await this.optionsRepository.save(result, options);
  }

  async findAll(options?: FindManyOptions<Option>): Promise<Option[]> {
    return await this.optionsRepository.find(options);
  }

  async findOne(options: FindOneOptions<Option>): Promise<Option | null> {
    return await this.optionsRepository.findOne(options);
  }

  async update(
    options: FindOptionsWhere<Option>,
    updateOptionDto: QueryDeepPartialEntity<Option>,
  ): Promise<UpdateResult> {
    return await this.optionsRepository.update(options, updateOptionDto);
  }

  async delete(criteria: FindOptionsWhere<Option>): Promise<DeleteResult> {
    return await this.optionsRepository.delete(criteria);
  }
}

export default OptionsService;
