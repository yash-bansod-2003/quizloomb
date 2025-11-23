import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1762626125823 implements MigrationInterface {
  name = "Migrations1762626125823";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "fields"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD "fields" jsonb NOT NULL`,
    );
  }
}
