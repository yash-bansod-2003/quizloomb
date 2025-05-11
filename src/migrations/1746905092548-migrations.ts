import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746905092548 implements MigrationInterface {
  name = "Migrations1746905092548";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quizzes" DROP CONSTRAINT "FK_122eef46f116c513a2ba12ad631"`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" RENAME COLUMN "resultId" TO "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" RENAME CONSTRAINT "PK_b11ee0d569c36080e8f2aa58453" TO "PK_e8f2a9191c61c15b627c117a678"`,
    );
    await queryRunner.query(
      `ALTER SEQUENCE "results_resultId_seq" RENAME TO "results_id_seq"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD "tags" text array NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "start_time" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "settings" ADD "end_time" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "has_time_limit" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "duration_minutes" integer NOT NULL DEFAULT '30'`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "prevent_new_tab" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_shuffle_mode_enum" AS ENUM('none', 'questions', 'answers', 'both')`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "shuffle_mode" "public"."settings_shuffle_mode_enum" NOT NULL DEFAULT 'none'`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "max_attempts" integer NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "show_results_after_submission" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "show_correct_answers" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_access_control_enum" AS ENUM('public', 'password', 'email_domain', 'invite_only')`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "access_control" "public"."settings_access_control_enum" NOT NULL DEFAULT 'public'`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "access_password" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "allowed_email_domains" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "ip_restriction" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "allowed_ip_addresses" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "enable_proctoring" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "webcam_required" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "record_screen" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "prevent_copy_paste" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "allow_navigation_between_questions" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "randomize_questions" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "one_question_per_page" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "show_progress" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD "allow_save_progress" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "quizzes" ADD "settingsId" integer`);
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "UQ_400a7be4d9f636c1a5cf92059e8" UNIQUE ("settingsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "FK_122eef46f116c513a2ba12ad631" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "FK_400a7be4d9f636c1a5cf92059e8" FOREIGN KEY ("settingsId") REFERENCES "settings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quizzes" DROP CONSTRAINT "FK_400a7be4d9f636c1a5cf92059e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" DROP CONSTRAINT "FK_122eef46f116c513a2ba12ad631"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" DROP CONSTRAINT "UQ_400a7be4d9f636c1a5cf92059e8"`,
    );
    await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "settingsId"`);
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "allow_save_progress"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "show_progress"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "one_question_per_page"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "randomize_questions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "allow_navigation_between_questions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "prevent_copy_paste"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "record_screen"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "webcam_required"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "enable_proctoring"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "allowed_ip_addresses"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "ip_restriction"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "allowed_email_domains"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "access_password"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "access_control"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."settings_access_control_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "show_correct_answers"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "show_results_after_submission"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "max_attempts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "shuffle_mode"`,
    );
    await queryRunner.query(`DROP TYPE "public"."settings_shuffle_mode_enum"`);
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "prevent_new_tab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "duration_minutes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP COLUMN "has_time_limit"`,
    );
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "end_time"`);
    await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "start_time"`);
    await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "tags"`);
    await queryRunner.query(
      `ALTER SEQUENCE "results_id_seq" RENAME TO "results_resultId_seq"`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" RENAME CONSTRAINT "PK_e8f2a9191c61c15b627c117a678" TO "PK_b11ee0d569c36080e8f2aa58453"`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" RENAME COLUMN "id" TO "resultId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quizzes" ADD CONSTRAINT "FK_122eef46f116c513a2ba12ad631" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
