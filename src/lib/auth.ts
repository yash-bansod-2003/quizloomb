import { betterAuth } from "better-auth";
import { typeormAdapter } from "@/adapters/typeorm-adapter.js";
import { AppDataSource } from "@/data-source.js";
import configuration from "@/config/configuration.js";

export const auth = betterAuth({
  database: typeormAdapter(AppDataSource),
  trustedOrigins: [configuration.domain],
  emailAndPassword: {
    enabled: true,
  },
});
