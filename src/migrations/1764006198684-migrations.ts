import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1764006198684 implements MigrationInterface {
  name = "Migrations1764006198684";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD "isCorrect" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD "pointsEarned" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "submissions" ADD "text" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "text"`);
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP COLUMN "pointsEarned"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP COLUMN "isCorrect"`,
    );
  }
}
