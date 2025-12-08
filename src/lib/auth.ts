import { betterAuth } from "better-auth";
import { typeormAdapter } from "@/adapters/typeorm-adapter.js";
import { AppDataSource } from "@/data-source.js";
import configuration from "@/lib/configuration.js";
import MailNotificationService from "@/services/notification/mail.js";
import logger from "@/lib/logger.js";

const mailService = new MailNotificationService(logger);

export const auth = betterAuth({
  database: typeormAdapter(AppDataSource),
  trustedOrigins: [configuration.domain],
  advanced: {
    ...(configuration.node_env === "development" && {
      disableOriginCheck: true,
    }),
    defaultCookieAttributes: {
      sameSite: "None",
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      const emailContent = {
        body: {
          name: user.name,
          intro: "We received a request to reset your password.",
          action: {
            instructions:
              "Click the button below to proceed with resetting your password:",
            button: {
              color: "#FF6136",
              text: "Reset Password",
              link: `${url}?token=${token}`,
            },
          },
          outro:
            "If you didn’t request a password reset, feel free to ignore this email. Your account is safe.",
        },
      };

      await mailService.send({
        email: user.email,
        subject: "Reset Your Password",
        content: emailContent,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      const emailContent = {
        body: {
          name: user.name,
          intro: "You're almost there!",
          action: {
            instructions:
              "To verify your email address and activate your account, please click the button below:",
            button: {
              color: "#22BC66",
              text: "Verify Email",
              link: `${url}?token=${token}`,
            },
          },
          outro:
            "If you didn't request this, feel free to ignore this message. Otherwise, welcome aboard!",
        },
      };
      await mailService.send({
        email: user.email,
        subject: "Please verify your email",
        content: emailContent,
      });
    },
  },
});
