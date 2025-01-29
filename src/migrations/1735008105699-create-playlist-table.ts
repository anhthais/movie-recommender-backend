import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlaylistTable1735008105699 implements MigrationInterface {
  name = 'CreatePlaylistTable1735008105699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "playlist_item" ("id" SERIAL NOT NULL, "movie_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "playlist_id" integer, CONSTRAINT "PK_958bd2e5a3e9728df21b5855dc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."playlist_accessibility_enum" AS ENUM('public', 'private')`,
    );
    await queryRunner.query(
      `CREATE TABLE "playlist" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "accessibility" "public"."playlist_accessibility_enum" NOT NULL DEFAULT 'public', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_538c2893e2024fabc7ae65ad142" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "playlist_item" ADD CONSTRAINT "FK_4b1dcd6418e9bfafccdb3358828" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "playlist" ADD CONSTRAINT "FK_a95382384c5ba920429ba111211" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "playlist" DROP CONSTRAINT "FK_a95382384c5ba920429ba111211"`,
    );
    await queryRunner.query(
      `ALTER TABLE "playlist_item" DROP CONSTRAINT "FK_4b1dcd6418e9bfafccdb3358828"`,
    );
    await queryRunner.query(`DROP TABLE "playlist"`);
    await queryRunner.query(`DROP TYPE "public"."playlist_accessibility_enum"`);
    await queryRunner.query(`DROP TABLE "playlist_item"`);
  }
}
