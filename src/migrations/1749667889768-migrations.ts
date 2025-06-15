import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749667889768 implements MigrationInterface {
  name = "Migrations1749667889768";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "credits" integer NOT NULL DEFAULT '20'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "credits"`);
  }
}
