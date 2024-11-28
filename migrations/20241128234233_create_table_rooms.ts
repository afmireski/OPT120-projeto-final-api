import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('rooms', (table) => {
        table.increments('id').primary();
        table.string('name', 200).notNullable();
        table.jsonb('informations').notNullable();
        table.time('opening_hour').notNullable();
        table.time('closing_hour').notNullable();
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('deleted_at').nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('rooms');
}

