import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746127436096 implements MigrationInterface {
  name = "Migrations1746127436096";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "tags"`);
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "tags" text array NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "tags"`);
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "tags" integer array NOT NULL`,
    );
  }
}
