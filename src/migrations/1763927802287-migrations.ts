import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1763927802287 implements MigrationInterface {
  name = "Migrations1763927802287";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "FK_ce7b8bfaa902496833c6c5cc30f"`,
    );
    await queryRunner.query(
      `CREATE TABLE "invitation" ("id" text NOT NULL, "email" text NOT NULL, "role" text, "status" text NOT NULL DEFAULT 'pending', "expiresAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" text, "organizationId" text, CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" text NOT NULL, "name" text NOT NULL, "slug" text NOT NULL, "logo" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "metadata" text, CONSTRAINT "UQ_a08804baa7c5d5427067c49a31f" UNIQUE ("slug"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "member" ("id" text NOT NULL, "role" text NOT NULL DEFAULT 'member', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" text, "organizationId" text, CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "options" ("id" text NOT NULL, "text" text NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "questionId" text, CONSTRAINT "PK_d232045bdb5c14d932fba18d957" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "answerId"`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD "activeOrganizationId" text`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."questions_type_enum" RENAME TO "questions_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."questions_type_enum" AS ENUM('mcq', 'trueFalse', 'written', 'multiSelect', 'shortAnswer', 'fillInTheBlank', 'matching', 'ordering', 'videoResponse', 'audioResponse', 'rating', 'fileUpload', 'survey', 'codeSnippet')`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "type" TYPE "public"."questions_type_enum" USING "type"::"text"::"public"."questions_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."questions_type_enum_old"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_896e5902333fa9991d1733e5ee" ON "verification" ("identifier") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_60328bf27019ff5498c4b97742" ON "account" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_05191060fae5b5485327709be7f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_5c00d7d515395f91bd1fee19f32" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_08897b166dee565859b7fb2fcc8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" ADD CONSTRAINT "FK_8122e5920a29af5ef76e2e2ff62" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "options" ADD CONSTRAINT "FK_46b668c49a6c4154d4643d875a5" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "options" DROP CONSTRAINT "FK_46b668c49a6c4154d4643d875a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_8122e5920a29af5ef76e2e2ff62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member" DROP CONSTRAINT "FK_08897b166dee565859b7fb2fcc8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_5c00d7d515395f91bd1fee19f32"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_05191060fae5b5485327709be7f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_60328bf27019ff5498c4b97742"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_896e5902333fa9991d1733e5ee"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."questions_type_enum_old" AS ENUM('mcq', 'trueFalse', 'multiSelect', 'written', 'video', 'rating', 'fileUpload', 'ranking', 'matrix')`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ALTER COLUMN "type" TYPE "public"."questions_type_enum_old" USING "type"::"text"::"public"."questions_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."questions_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."questions_type_enum_old" RENAME TO "questions_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP COLUMN "activeOrganizationId"`,
    );
    await queryRunner.query(`ALTER TABLE "submissions" ADD "answerId" text`);
    await queryRunner.query(`DROP TABLE "options"`);
    await queryRunner.query(`DROP TABLE "member"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "invitation"`);
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_ce7b8bfaa902496833c6c5cc30f" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
