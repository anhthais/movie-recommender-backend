import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMoviePersonTable1736780116922 implements MigrationInterface {
  name = ' CreateMoviePersonTable1736780116922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "person" ("id" integer NOT NULL, "name" character varying NOT NULL, "adults" boolean NOT NULL, "also_known_as" character varying array, "biography" text, "birthday" date NOT NULL, "deathday" date, "place_of_birth" text, "gender" integer NOT NULL, "known_for_department" character varying, "homepage" character varying, "imdb_id" character varying, "popularity" double precision NOT NULL, "profile_path" character varying, CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movies_casts_combined" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "profile_image" character varying NOT NULL, "character" character varying NOT NULL, "movieIdId" character varying(24) NOT NULL, "castIdId" integer NOT NULL, CONSTRAINT "PK_b7616f6a6f530a8fde6f18c74e9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movie" ("id" character varying(24) NOT NULL, "tmdb_id" integer NOT NULL, "backdrop_path" text, "title" character varying(255), "original_title" character varying(255), "tagline" text, "release_date" date, "budget" double precision NOT NULL DEFAULT '0', "revenue" double precision NOT NULL DEFAULT '0', "runtime" integer, "popularity" double precision, "video" boolean NOT NULL DEFAULT false, "status" character varying(50), "poster_path" text, "genres" integer array, "trailers" character varying array, "overview" text, "keywords" character varying, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "movies_casts_combined" ADD CONSTRAINT "FK_07d944364a1100c4722525e7917" FOREIGN KEY ("movieIdId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "movies_casts_combined" ADD CONSTRAINT "FK_fda1bd93576c8d9d5496fa20ac0" FOREIGN KEY ("castIdId") REFERENCES "person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movies_casts_combined" DROP CONSTRAINT "FK_fda1bd93576c8d9d5496fa20ac0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "movies_casts_combined" DROP CONSTRAINT "FK_07d944364a1100c4722525e7917"`,
    );
    await queryRunner.query(`DROP TABLE "movie"`);
    await queryRunner.query(`DROP TABLE "movies_casts_combined"`);
    await queryRunner.query(`DROP TABLE "person"`);
  }
}
