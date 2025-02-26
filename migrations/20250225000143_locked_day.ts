import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('locked', (table) => {
        table.date('day').primary();
        table.integer('room_id').unsigned().primary();
        table.foreign('room_id').references('id').inTable('rooms');

    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('locked');
}

