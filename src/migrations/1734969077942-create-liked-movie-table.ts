import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLikedMovieTable1734969077942 implements MigrationInterface {
  name = 'CreateLikedMovieTable1734969077942';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "liked_movie" ("id" SERIAL NOT NULL, "movie_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_2701691b1d7256c0f686bc35a18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "liked_movie" ADD CONSTRAINT "FK_b9f70a97324ddcefc45ed87190b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "liked_movie" DROP CONSTRAINT "FK_b9f70a97324ddcefc45ed87190b"`,
    );
    await queryRunner.query(`DROP TABLE "liked_movie"`);
  }
}
