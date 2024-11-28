import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email', 200).unique().notNullable();
        table.string('ra', 8).unique();
        table.string('password', 200).notNullable();
        table.enu('role', ['student', 'teacher', 'admin'], {
            enumName: 'user_role',
            useNative: true,
        }).notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('deleted_at').nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users').then(() => {
        return knex.raw('DROP TYPE IF EXISTS user_role');
    });
}

