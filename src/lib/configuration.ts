import { config } from "dotenv";
import { z } from "zod";

config();

const configurationSchema = z.object({
  node_env: z.string(),
  domain: z.string().optional(),
  database: z.object({
    host: z.string(),
    port: z.number(),
    user: z.string(),
    password: z.string(),
    database: z.string(),
  }),
  ai: z.object({
    key: z.string(),
  }),
  jwt: z.object({
    quiz: z.object({
      secret: z.string(),
    }),
  }),
  smtp: z.object({
    service: z.string(),
    username: z.string(),
    password: z.string(),
  }),
});

const rawConfiguration = {
  node_env: process.env.NODE_ENV,
  domain: process.env.DOMAIN,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? "5432"),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  },
  ai: {
    key: process.env.GEMINIAI_API_KEY,
  },
  jwt: {
    quiz: {
      secret: process.env.JWT_QUIZ_SECRET,
    },
  },
  smtp: {
    service: process.env.SMTP_SERVICE,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  },
};

export default configurationSchema.parse(rawConfiguration);
