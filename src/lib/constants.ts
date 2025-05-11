import configuration from "@/config/configuration.js";
export const TOKEN_PROPERTIES = {
  VERIFICATION_TOKEN_EXPIRES_IN: "10m",
  ACCESS_TOKEN_EXPIRES_IN: "1h",
  REFRESH_TOKEN_EXPIRES_IN: "1w",
} as const;

export const COOKIE_PROPERTIES = {
  HTTP_ONLY: true,
  SECURE: configuration.node_env === "production",
  SAME_SITE: "strict",
  ACCESS_TOKEN_COOKIE_NAME: "access_token",
  REFRESH_TOKEN_COOKIE_NAME: "refresh_token",
  QUIZ_TOKEN_COOKIE_NAME: "quiz_token",
  ACCESS_TOKEN_COOKIE_MAX_AGE: 1000 * 60 * 60,
  REFRESH_TOKEN_COOKIE_MAX_AGE: 1000 * 60 * 60 * 24 * 7,
  DOMAIN: configuration.domain,
} as const;
