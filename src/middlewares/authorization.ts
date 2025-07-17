import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { AuthenticatedRequest } from "@/middlewares/authenticate.js";
import { AppDataSource } from "@/data-source.js";
import { User } from "@/entities/auth/User.js";

import UsersService from "@/services/users.service.js";
const usersRepository = AppDataSource.getRepository(User);
const usersService = new UsersService(usersRepository);

const authorization = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as AuthenticatedRequest).user.id;
    if (!userId) {
      return next(createHttpError.Unauthorized());
    }
    const user = await usersService.findOne({ where: { id: userId } });

    if (!user) {
      return next(createHttpError.Unauthorized());
    }

    const role = "student";
    if (!roles.includes(role)) {
      return next(createHttpError.Forbidden());
    }
    next();
  };
};

export default authorization;
