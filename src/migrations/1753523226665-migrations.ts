import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1753523226665 implements MigrationInterface {
  name = "Migrations1753523226665";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."questions_difficulty_enum" AS ENUM('high', 'low', 'medium')`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "difficulty" "public"."questions_difficulty_enum" NOT NULL DEFAULT 'medium'`,
    );
    await queryRunner.query(`ALTER TABLE "results" ADD "system" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "results" ADD "location" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "results" DROP COLUMN "location"`);
    await queryRunner.query(`ALTER TABLE "results" DROP COLUMN "system"`);
    await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "difficulty"`);
    await queryRunner.query(`DROP TYPE "public"."questions_difficulty_enum"`);
  }
}
