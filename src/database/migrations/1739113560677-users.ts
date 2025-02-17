import { MigrationInterface, QueryRunner } from "typeorm"

export class UsersMigration1739113560677 implements MigrationInterface {
    name = 'UsersMigration1739113560677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR(100) UNIQUE NOT NULL,
                "name" VARCHAR(255) NOT NULL,
                "email" VARCHAR(255) UNIQUE NOT NULL,
                "password" TEXT NOT NULL,
                "created_at" TIMESTAMP DEFAULT NOW()
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`)
    }
}
