import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1753859123447 implements MigrationInterface {
    name = 'Migrations1753859123447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "results" RENAME COLUMN "sessionId" TO "quizSessionId"`);
        await queryRunner.query(`CREATE TABLE "quiz_sessions" ("id" text NOT NULL, "expiry" TIMESTAMP NOT NULL, "fields" jsonb NOT NULL, "questions" text array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quizId" text, CONSTRAINT "PK_db4ac35661dd2f29269b272a4c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "results" ALTER COLUMN "quizSessionId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "UQ_d1d78d3279ebf373a7229f55ebd" UNIQUE ("quizSessionId")`);
        await queryRunner.query(`ALTER TABLE "quiz_sessions" ADD CONSTRAINT "FK_a7e6751fe58d7feabcf0fce588d" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_d1d78d3279ebf373a7229f55ebd" FOREIGN KEY ("quizSessionId") REFERENCES "quiz_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_d1d78d3279ebf373a7229f55ebd"`);
        await queryRunner.query(`ALTER TABLE "quiz_sessions" DROP CONSTRAINT "FK_a7e6751fe58d7feabcf0fce588d"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "UQ_d1d78d3279ebf373a7229f55ebd"`);
        await queryRunner.query(`ALTER TABLE "results" ALTER COLUMN "quizSessionId" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "quiz_sessions"`);
        await queryRunner.query(`ALTER TABLE "results" RENAME COLUMN "quizSessionId" TO "sessionId"`);
    }

}
