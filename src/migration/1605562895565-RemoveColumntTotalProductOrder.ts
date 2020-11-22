import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveColumntTotalProductOrder1605562895565 implements MigrationInterface {
    name = 'RemoveColumntTotalProductOrder1605562895565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_order" DROP COLUMN "total"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_order" ADD "total" integer NOT NULL`);
    }

}
