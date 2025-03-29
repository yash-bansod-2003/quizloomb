import "reflect-metadata";
import { Express } from "express";
import { createServer } from "@/server.js";
import { AppDataSource } from "@/data-source.js";
import logger from "@/config/logger.js";

const port = 5000;
const host = "0.0.0.0";
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
