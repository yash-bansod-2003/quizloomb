import { createLogger, transports, format } from "winston";
import configuration from "@/config/configuration.js";

const logger = createLogger({
  level: "info",
  defaultMeta: { serviceName: "templete" },
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(format.timestamp(), format.simple()),
      silent: configuration.node_env === "test",
    }),
  ],
});

export default logger;
