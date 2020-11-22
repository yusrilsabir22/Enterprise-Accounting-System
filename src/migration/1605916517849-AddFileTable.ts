import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFileTable1605916517849 implements MigrationInterface {
    name = 'AddFileTable1605916517849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ADD "location" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "location"`);
    }

}
