import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV}` });

const configuration = {
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

export default configuration;
