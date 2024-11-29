import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('hours', (table) => {
        table.increments('id').primary();
        table.integer('room_id').unsigned().notNullable();
        table.integer('week_day').unsigned().notNullable();
        table.time('opening').notNullable();
        table.time('closing').notNullable();
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('deleted_at').nullable();

        table.foreign('room_id').references('id').inTable('rooms');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('hours');
}

