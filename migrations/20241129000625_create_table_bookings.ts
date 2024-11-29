import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('bookings', (table) => {
        table.increments('id').primary();
        table.integer('room_id').unsigned().notNullable();
        table.integer('hour_id').unsigned().notNullable();
        table.integer('user_id').unsigned();
        table.date('day').notNullable();
        table.boolean('approved').notNullable().defaultTo(false);
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());

        table.unique(['room_id', 'hour_id', 'day']);

        table.foreign('room_id').references('id').inTable('rooms');
        table.foreign('hour_id').references('id').inTable('hours');
        table.foreign('user_id').references('id').inTable('users');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('bookings');
}

