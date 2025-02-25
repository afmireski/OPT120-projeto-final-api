import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('bookings', table => {
        table.integer('user_id').unsigned().notNullable().alter();
        table.dropColumn('approved');

        table.enum(
            'state',
            ['PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'EXPIRED'],
            { useNative: true, enumName: 'booking_state' },
        ).notNullable();
        table.timestamp('approved_at').nullable();
        table.timestamp('rejected_at').nullable();
        table.timestamp('canceled_at').nullable();

        table.integer('approved_by').unsigned().nullable();
        table.integer('reject_by').unsigned().nullable();
        table.integer('canceled_by').unsigned().nullable();

        table.dropUnique(['room_id', 'hour_id', 'day']);
        table.unique(['room_id', 'hour_id', 'day', 'user_id']);

        table.foreign('approved_by').references('id').inTable('users');
        table.foreign('reject_by').references('id').inTable('users');
        table.foreign('canceled_by').references('id').inTable('users');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('bookings', table => {
        table.integer('user_id').unsigned().nullable().alter();
        table.boolean('approved').notNullable().defaultTo(false);
        
        table.dropColumn('state');
        table.dropColumn('approved_at');
        table.dropColumn('rejected_at');
        table.dropColumn('canceled_at');

        table.dropColumn('approved_by');
        table.dropColumn('reject_by');
        table.dropColumn('canceled_by');

        table.dropUnique(['room_id', 'hour_id', 'day', 'user_id']);
        table.unique(['room_id', 'hour_id', 'day']);
        
    }).then(() => {
        return knex.raw('DROP TYPE booking_state');
    });
}

