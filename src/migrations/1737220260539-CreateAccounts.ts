import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccounts1737220260539 implements MigrationInterface {
    name = 'CreateAccounts1737220260539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."accounts_type_enum" AS ENUM('BANK', 'MOBILE_MONEY', 'CASH')`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "name" character varying NOT NULL, "type" "public"."accounts_type_enum" NOT NULL, "balance" numeric(10,2) NOT NULL DEFAULT '0', "currency" character varying(3) NOT NULL DEFAULT 'USD', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TYPE "public"."accounts_type_enum"`);
    }

}
