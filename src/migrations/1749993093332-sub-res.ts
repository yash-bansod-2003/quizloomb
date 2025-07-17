import { MigrationInterface, QueryRunner } from "typeorm";

export class SubRes1749993093332 implements MigrationInterface {
  name = "SubRes1749993093332";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "submissions" ADD "userId" text`);
    await queryRunner.query(`ALTER TABLE "results" ADD "userId" text`);
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_eae888413ab8fc63cc48759d46a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" ADD CONSTRAINT "FK_c435fd895ea26113b42e65d0b52" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "results" DROP CONSTRAINT "FK_c435fd895ea26113b42e65d0b52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "FK_eae888413ab8fc63cc48759d46a"`,
    );
    await queryRunner.query(`ALTER TABLE "results" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "submissions" DROP COLUMN "userId"`);
  }
}
