import { MigrationInterface, QueryRunner } from 'typeorm';

export class ElectricityHistoryMigration1767573548880 implements MigrationInterface {
  name = 'ElectricityHistoryMigration1767573548880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "electricity_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "remaining_token" double precision NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_0db1a6e6f3790917976798f4d2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "electricity_history" ADD CONSTRAINT "FK_b2c529bede60d11f5c25e6df4b7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "electricity_history" DROP CONSTRAINT "FK_b2c529bede60d11f5c25e6df4b7"`,
    );
    await queryRunner.query(`DROP TABLE "electricity_history"`);
  }
}
