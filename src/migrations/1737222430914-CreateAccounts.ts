import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccounts1737222430914 implements MigrationInterface {
    name = 'CreateAccounts1737222430914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."categories_type_enum" AS ENUM('INCOME', 'EXPENSE')`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "name" character varying NOT NULL, "type" "public"."categories_type_enum" NOT NULL, "parent_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_2296b7fe012d95646fa41921c8b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_88cea2dc9c31951d06437879b40"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_2296b7fe012d95646fa41921c8b"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TYPE "public"."categories_type_enum"`);
    }

}
