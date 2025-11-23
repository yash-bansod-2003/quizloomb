import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1753512293876 implements MigrationInterface {
  name = "Migrations1753512293876";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "verification" ("id" text NOT NULL, "identifier" text NOT NULL, "value" text NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" text NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "token" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ipAddress" text, "userAgent" text, "userId" text NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_232f8e85d7633bd6ddfad42169" ON "session" ("token") `,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("id" text NOT NULL, "accountId" text NOT NULL, "providerId" text NOT NULL, "userId" text NOT NULL, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" TIMESTAMP, "refreshTokenExpiresAt" TIMESTAMP, "scope" text, "password" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" text NOT NULL, "email" text NOT NULL, "name" text, "emailVerified" boolean NOT NULL, "image" text, "credits" integer NOT NULL DEFAULT '20', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."results_status_enum" AS ENUM('pending', 'completed', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "results" ("id" text NOT NULL, "score" integer NOT NULL, "attempt" integer NOT NULL DEFAULT '1', "sessionId" text NOT NULL, "status" "public"."results_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" text, CONSTRAINT "PK_e8f2a9191c61c15b627c117a678" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_shufflemode_enum" AS ENUM('none', 'questions', 'answers', 'both')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_accesscontrol_enum" AS ENUM('public', 'password', 'email_domain', 'invite_only')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_nextquiztransitionmode_enum" AS ENUM('manual', 'automatic')`,
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("id" text NOT NULL, "startTime" TIMESTAMP, "endTime" TIMESTAMP, "hasTimeLimit" boolean NOT NULL DEFAULT false, "durationMinutes" integer NOT NULL DEFAULT '30', "numberOfQuestionsToDisplay" integer, "showTotalQuestionsAtStart" boolean NOT NULL DEFAULT true, "fullscreen" boolean NOT NULL DEFAULT true, "preventNewTab" boolean NOT NULL DEFAULT false, "shuffleMode" "public"."settings_shufflemode_enum" NOT NULL DEFAULT 'none', "maxAttempts" integer NOT NULL DEFAULT '1', "showResultsAfterSubmission" boolean NOT NULL DEFAULT true, "showCorrectAnswers" boolean NOT NULL DEFAULT false, "accessControl" "public"."settings_accesscontrol_enum" NOT NULL DEFAULT 'public', "accessPassword" character varying, "allowedEmailDomains" character varying, "showCountdownTimer" boolean NOT NULL DEFAULT true, "autoProgressToNextQuiz" boolean NOT NULL DEFAULT false, "progressOnlyOnPass" boolean NOT NULL DEFAULT false, "nextQuizTransitionMode" "public"."settings_nextquiztransitionmode_enum" NOT NULL DEFAULT 'manual', "timeZone" character varying, "ipRestriction" boolean NOT NULL DEFAULT false, "allowedIpAddresses" text, "ipRangeStart" character varying, "ipRangeEnd" character varying, "enableProctoring" boolean NOT NULL DEFAULT false, "webcamRequired" boolean NOT NULL DEFAULT false, "recordScreen" boolean NOT NULL DEFAULT false, "preventCopyPaste" boolean NOT NULL DEFAULT false, "disablePrintScreen" boolean NOT NULL DEFAULT false, "disableCopy" boolean NOT NULL DEFAULT false, "restrictTabSwitching" boolean NOT NULL DEFAULT false, "disablePasteInEssay" boolean NOT NULL DEFAULT false, "highlightPastedEssayContent" boolean NOT NULL DEFAULT false, "allowNavigationBetweenQuestions" boolean NOT NULL DEFAULT true, "randomizeQuestions" boolean NOT NULL DEFAULT false, "oneQuestionPerPage" boolean NOT NULL DEFAULT false, "showProgress" boolean NOT NULL DEFAULT true, "allowSaveProgress" boolean NOT NULL DEFAULT false, "totalPoints" integer NOT NULL DEFAULT '100', "passingScore" double precision, "negativeMarking" boolean NOT NULL DEFAULT false, "negativePointsPerWrongAnswer" double precision, "allowSkipQuestions" boolean NOT NULL DEFAULT true, "detectAbsence" boolean NOT NULL DEFAULT false, "detectDeskExit" boolean NOT NULL DEFAULT false, "detectMultiplePeople" boolean NOT NULL DEFAULT false, "detectWindowSwitch" boolean NOT NULL DEFAULT false, "enableGazeDetection" boolean NOT NULL DEFAULT false, "gazeAwayThresholdSeconds" integer NOT NULL DEFAULT '5', "fields" jsonb NOT NULL DEFAULT '[{"name":"name","type":"text","label":"Name","enabled":true,"required":true,"placeholder":"Enter your name"},{"name":"email","type":"email","label":"Email","enabled":true,"required":true,"placeholder":"Enter your email"},{"name":"phone","type":"tel","label":"Phone","enabled":false,"required":false,"placeholder":"Enter your phone number"},{"name":"organization","type":"text","label":"Organization","enabled":false,"required":false,"placeholder":"Enter your organization name"}]', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."quizzes_status_enum" AS ENUM('draft', 'live', 'paused', 'scheduled', 'closed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "quizzes" ("id" text NOT NULL, "title" text NOT NULL, "image" text, "bannerImage" text, "status" "public"."quizzes_status_enum" NOT NULL DEFAULT 'live', "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" text, "settingsId" text, CONSTRAINT "REL_400a7be4d9f636c1a5cf92059e" UNIQUE ("settingsId"), CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answers" ("id" text NOT NULL, "text" text NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "questionId" text, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."questions_type_enum" AS ENUM('mcq', 'trueFalse', 'multiSelect', 'written', 'video', 'rating', 'fileUpload', 'ranking', 'matrix')`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" text NOT NULL, "text" text NOT NULL, "type" "public"."questions_type_enum" NOT NULL, "points" integer NOT NULL DEFAULT '1', "tags" text array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" text, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "submissions" ("id" text NOT NULL, "sessionId" text NOT NULL, "fields" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" text, "questionId" text, "answerId" text, "resultId" text, CONSTRAINT "PK_10b3be95b8b2fb1e482e07d706b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" ADD CONSTRAINT "FK_cc253a7c95351ca1e57560db462" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "FK_122eef46f116c513a2ba12ad631" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "FK_400a7be4d9f636c1a5cf92059e8" FOREIGN KEY ("settingsId") REFERENCES "settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_d96c178c01673ecccc0e8d6186c" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_b66f37dc36f198ef285056fdeb9" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_ce7b8bfaa902496833c6c5cc30f" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_5c028222ba21484a5e0a042093b" FOREIGN KEY ("resultId") REFERENCES "results"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "FK_5c028222ba21484a5e0a042093b"`,
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
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`,
    );
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
      `ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(`DROP TABLE "submissions"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TYPE "public"."questions_type_enum"`);
    await queryRunner.query(`DROP TABLE "answers"`);
    await queryRunner.query(`DROP TABLE "quizzes"`);
    await queryRunner.query(`DROP TYPE "public"."quizzes_status_enum"`);
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(
      `DROP TYPE "public"."settings_nextquiztransitionmode_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."settings_accesscontrol_enum"`);
    await queryRunner.query(`DROP TYPE "public"."settings_shufflemode_enum"`);
    await queryRunner.query(`DROP TABLE "results"`);
    await queryRunner.query(`DROP TYPE "public"."results_status_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_232f8e85d7633bd6ddfad42169"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "verification"`);
  }
}
