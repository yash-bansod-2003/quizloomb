import "reflect-metadata";
import { Express } from "express";
import { createServer } from "@/server.js";
import configuration from "@/config/configuration.js";
import { AppDataSource } from "@/data-source.js";
import logger from "@/config/logger.js";

const port = configuration.port ? parseInt(configuration.port) : 5000;
const host = configuration.host ?? "localhost";
const server: Express = createServer();

server.listen(port, host, () => {
  AppDataSource.initialize()
    .then(() => {
      logger.info(`Server Listening on  http://${host}:${port}`);
    })
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    });
});
