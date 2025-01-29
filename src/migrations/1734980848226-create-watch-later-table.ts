import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWatchLaterTable1734980848226 implements MigrationInterface {
  name = 'CreateWatchLaterTable1734980848226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "watch_later" ("id" SERIAL NOT NULL, "movie_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_6b5e31210dfa78b187b51c5f1e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "watch_later" ADD CONSTRAINT "FK_6c4cedb2e0077b40400e51f1ea4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "watch_later" DROP CONSTRAINT "FK_6c4cedb2e0077b40400e51f1ea4"`,
    );
    await queryRunner.query(`DROP TABLE "watch_later"`);
  }
}
