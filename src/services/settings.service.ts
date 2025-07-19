import { Settings } from "@/entities/Settings.js";
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

class SettingsService {
  constructor(private readonly settingsRepository: Repository<Settings>) {}

  async create(
    createSettingsDto: DeepPartial<Settings>,
    options?: SaveOptions,
  ) {
    const settings = this.settingsRepository.create(createSettingsDto);
    return await this.settingsRepository.save(settings, options);
  }

  async findAll(options?: FindManyOptions<Settings>): Promise<Settings[]> {
    return await this.settingsRepository.find(options);
  }

  async findOne(options: FindOneOptions<Settings>): Promise<Settings | null> {
    return await this.settingsRepository.findOne(options);
  }

  async update(
    options: FindOptionsWhere<Settings>,
    updateSettingsDto: QueryDeepPartialEntity<Settings>,
  ): Promise<UpdateResult> {
    return await this.settingsRepository.update(options, updateSettingsDto);
  }

  async delete(criteria: FindOptionsWhere<Settings>): Promise<DeleteResult> {
    return await this.settingsRepository.delete(criteria);
  }
}

export default SettingsService;
