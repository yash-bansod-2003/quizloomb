import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746951336164 implements MigrationInterface {
  name = "Migrations1746951336164";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "results" DROP CONSTRAINT "FK_c435fd895ea26113b42e65d0b52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "FK_eae888413ab8fc63cc48759d46a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" RENAME COLUMN "userId" TO "session_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" RENAME COLUMN "userId" TO "session_id"`,
    );
    await queryRunner.query(`ALTER TABLE "results" DROP COLUMN "session_id"`);
    await queryRunner.query(
      `ALTER TABLE "results" ADD "session_id" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP COLUMN "session_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD "session_id" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP COLUMN "session_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD "session_id" integer`,
    );
    await queryRunner.query(`ALTER TABLE "results" DROP COLUMN "session_id"`);
    await queryRunner.query(`ALTER TABLE "results" ADD "session_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "submissions" RENAME COLUMN "session_id" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" RENAME COLUMN "session_id" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_eae888413ab8fc63cc48759d46a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" ADD CONSTRAINT "FK_c435fd895ea26113b42e65d0b52" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
