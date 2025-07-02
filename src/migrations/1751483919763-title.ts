import { MigrationInterface, QueryRunner } from "typeorm";

export class Title1751483919763 implements MigrationInterface {
  name = "Title1751483919763";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quizzes" RENAME COLUMN "name" TO "title"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quizzes" RENAME COLUMN "title" TO "name"`,
    );
  }
}
