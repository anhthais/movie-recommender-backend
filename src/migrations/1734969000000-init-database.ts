import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1734969000000 implements MigrationInterface {
  name = 'InitDatabase1734969000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_provider_enum" AS ENUM('local', 'google')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "fullname" character varying NOT NULL, "activated" boolean NOT NULL DEFAULT false, "disabled" boolean NOT NULL DEFAULT false, "provider" "public"."user_provider_enum" NOT NULL DEFAULT 'local', "picture" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_provider_enum"`);
  }
}
