import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746084430793 implements MigrationInterface {
  name = "Migrations1746084430793";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'student'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`,
    );
  }
}
