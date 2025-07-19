import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1752940405479 implements MigrationInterface {
  name = "Migrations1752940405479";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quizzes" ADD "image" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "image"`);
  }
}
