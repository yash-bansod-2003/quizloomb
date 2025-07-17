import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749585916551 implements MigrationInterface {
  name = "Migrations1749585916551";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "identifier" text NOT NULL, "value" text NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expiresAt" TIMESTAMP NOT NULL, "token" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ipAddress" text, "userAgent" text, "userId" uuid NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_232f8e85d7633bd6ddfad42169" ON "session" ("token") `,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountId" text NOT NULL, "providerId" text NOT NULL, "userId" uuid NOT NULL, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" TIMESTAMP, "refreshTokenExpiresAt" TIMESTAMP, "scope" text, "password" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "attempt" integer NOT NULL DEFAULT '1', "sessionId" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" uuid, "questionId" uuid, "answerId" uuid, CONSTRAINT "PK_10b3be95b8b2fb1e482e07d706b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "questionId" uuid, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" text NOT NULL, "type" text NOT NULL, "tags" text array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" uuid, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "results" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "score" integer NOT NULL, "attempt" integer NOT NULL DEFAULT '1', "sessionId" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" uuid, CONSTRAINT "PK_e8f2a9191c61c15b627c117a678" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_shufflemode_enum" AS ENUM('none', 'questions', 'answers', 'both')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_accesscontrol_enum" AS ENUM('public', 'password', 'email_domain', 'invite_only')`,
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" TIMESTAMP, "endTime" TIMESTAMP, "hasTimeLimit" boolean NOT NULL DEFAULT false, "durationMinutes" integer NOT NULL DEFAULT '30', "fullscreen" boolean NOT NULL DEFAULT true, "preventNewTab" boolean NOT NULL DEFAULT false, "shuffleMode" "public"."settings_shufflemode_enum" NOT NULL DEFAULT 'none', "maxAttempts" integer NOT NULL DEFAULT '1', "showResultsAfterSubmission" boolean NOT NULL DEFAULT true, "showCorrectAnswers" boolean NOT NULL DEFAULT false, "accessControl" "public"."settings_accesscontrol_enum" NOT NULL DEFAULT 'public', "accessPassword" character varying, "allowedEmailDomains" character varying, "ipRestriction" boolean NOT NULL DEFAULT false, "allowedIpAddresses" text, "enableProctoring" boolean NOT NULL DEFAULT false, "webcamRequired" boolean NOT NULL DEFAULT false, "recordScreen" boolean NOT NULL DEFAULT false, "preventCopyPaste" boolean NOT NULL DEFAULT false, "allowNavigationBetweenQuestions" boolean NOT NULL DEFAULT true, "randomizeQuestions" boolean NOT NULL DEFAULT false, "oneQuestionPerPage" boolean NOT NULL DEFAULT false, "showProgress" boolean NOT NULL DEFAULT true, "allowSaveProgress" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quizzes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "settingsId" uuid, CONSTRAINT "REL_400a7be4d9f636c1a5cf92059e" UNIQUE ("settingsId"), CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "name" text, "emailVerified" boolean NOT NULL, "image" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_d96c178c01673ecccc0e8d6186c" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_b66f37dc36f198ef285056fdeb9" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_ce7b8bfaa902496833c6c5cc30f" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" ADD CONSTRAINT "FK_cc253a7c95351ca1e57560db462" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "FK_122eef46f116c513a2ba12ad631" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "FK_400a7be4d9f636c1a5cf92059e8" FOREIGN KEY ("settingsId") REFERENCES "settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quizzes" DROP CONSTRAINT "FK_400a7be4d9f636c1a5cf92059e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" DROP CONSTRAINT "FK_122eef46f116c513a2ba12ad631"`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" DROP CONSTRAINT "FK_cc253a7c95351ca1e57560db462"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "FK_ce7b8bfaa902496833c6c5cc30f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "FK_b66f37dc36f198ef285056fdeb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "FK_d96c178c01673ecccc0e8d6186c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "quizzes"`);
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP TYPE "public"."settings_accesscontrol_enum"`);
    await queryRunner.query(`DROP TYPE "public"."settings_shufflemode_enum"`);
    await queryRunner.query(`DROP TABLE "results"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TABLE "answers"`);
    await queryRunner.query(`DROP TABLE "submissions"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_232f8e85d7633bd6ddfad42169"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "verification"`);
  }
}
