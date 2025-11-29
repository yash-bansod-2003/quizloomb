import { User } from "@/entities/auth/user.js";
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SaveOptions,
  UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";

class UsersService {
  constructor(private readonly usersRepository: Repository<User>) {}

  async create(createUserDto: DeepPartial<User>, options?: SaveOptions) {
    const result = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(result, options);
  }

  async findAll(options?: FindManyOptions<User>): Promise<[User[], number]> {
    return await this.usersRepository.findAndCount(options);
  }

  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return await this.usersRepository.findOne(options);
  }

  async update(
    options: FindOptionsWhere<User>,
    updateUserDto: QueryDeepPartialEntity<User>,
  ): Promise<UpdateResult> {
    return await this.usersRepository.update(options, updateUserDto);
  }

  async delete(criteria: FindOptionsWhere<User>): Promise<DeleteResult> {
    return await this.usersRepository.delete(criteria);
  }
}

export default UsersService;
