import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1764005175115 implements MigrationInterface {
  name = "Migrations1764005175115";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "teamMember" ("id" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" text, "teamId" text, CONSTRAINT "PK_d6611eb8da5ea5a79d9247158ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team" ("id" text NOT NULL, "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" text, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "session" ADD "activeTeamId" text`);
    await queryRunner.query(`ALTER TABLE "invitation" ADD "teamId" text`);
    await queryRunner.query(
      `ALTER TABLE "teamMember" ADD CONSTRAINT "FK_d8ff14502ae283127b55fe0595b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teamMember" ADD CONSTRAINT "FK_42e2c6b0dfb774091a9e863fb1c" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_12e10686074dba7e8fd02f41bf4" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_9255d6b3088797d8bdbc18a4b7f" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_9255d6b3088797d8bdbc18a4b7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_12e10686074dba7e8fd02f41bf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teamMember" DROP CONSTRAINT "FK_42e2c6b0dfb774091a9e863fb1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teamMember" DROP CONSTRAINT "FK_d8ff14502ae283127b55fe0595b"`,
    );
    await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "teamId"`);
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "activeTeamId"`);
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP TABLE "teamMember"`);
  }
}
