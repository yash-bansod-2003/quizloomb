import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1752346588996 implements MigrationInterface {
  name = "Migrations1752346588996";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "numberOfQuestionsToDisplay" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "showTotalQuestionsAtStart" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "showCountdownTimer" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "autoProgressToNextQuiz" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "progressOnlyOnPass" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_nextquiztransitionmode_enum" AS ENUM('manual', 'automatic')`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "nextQuizTransitionMode" "public"."settings_nextquiztransitionmode_enum" NOT NULL DEFAULT 'manual'`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "timeZone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "ipRangeStart" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "ipRangeEnd" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "disablePrintScreen" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "disableCopy" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "restrictTabSwitching" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "disablePasteInEssay" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "highlightPastedEssayContent" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "totalPoints" integer NOT NULL DEFAULT '100'`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "passingScore" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "negativeMarking" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "negativePointsPerWrongAnswer" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "allowSkipQuestions" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "detectAbsence" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "detectDeskExit" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "detectMultiplePeople" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "detectWindowSwitch" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "enableGazeDetection" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "gazeAwayThresholdSeconds" integer NOT NULL DEFAULT '5'`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD "status" text NOT NULL DEFAULT 'live'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "gazeAwayThresholdSeconds"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "enableGazeDetection"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "detectWindowSwitch"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "detectMultiplePeople"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "detectDeskExit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "detectAbsence"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "allowSkipQuestions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "negativePointsPerWrongAnswer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "negativeMarking"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "passingScore"`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "totalPoints"`);
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "highlightPastedEssayContent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "disablePasteInEssay"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "restrictTabSwitching"`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "disableCopy"`);
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "disablePrintScreen"`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "ipRangeEnd"`);
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "ipRangeStart"`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "timeZone"`);
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "nextQuizTransitionMode"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."settings_nextquiztransitionmode_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "progressOnlyOnPass"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "autoProgressToNextQuiz"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "showCountdownTimer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "showTotalQuestionsAtStart"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "numberOfQuestionsToDisplay"`,
    );
  }
}
