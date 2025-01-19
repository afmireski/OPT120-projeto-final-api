import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await clearTables(knex);

  await Promise.all([
    seedUsers(knex), 
    seedRooms(knex), 
  ]);

  await seedHours(knex);
  await seedBookings(knex)
}

const clearTables = async (knex: Knex): Promise<void> => {
  await knex('bookings').del();
  await knex('hours').del();
  await knex('rooms').del();
  await knex('users').del();
};

const seedUsers = async (knex: Knex): Promise<void> => {
  const PASSWORD =
    '$2a$10$krak09cAf0L0M/91/AzYieYSKNDvoz3yXW2Phl5HnOL8KUFQBUmBq';
  await knex('users').insert([
    {
      id: 1,
      email: 'admin@email.com',
      password: PASSWORD,
      name: 'Admin',
      role: 'ADMIN',
    },
    {
      id: 2,
      email: 'student@email.com',
      password: PASSWORD,
      ra: '1234567',
      name: 'Student',
      role: 'STUDENT',
    },
    {
      id: 3,
      email: 'servant@email.com',
      password: PASSWORD,
      name: 'Servant',
      role: 'SERVANT',
    },
  ]);
};

const seedRooms = async (knex: Knex): Promise<void> => {
  await knex('rooms').insert([
    {
      id: 1,
      name: 'Room 1',
      opening_hour: '08:00',
      closing_hour: '18:00',
      informations: {
        capacity: 10,
        resources: ['Projetor', 'Computador'],
        description: 'Sala de reunião',
      },
    },
    {
      id: 2,
      name: 'Room 2',
      opening_hour: '08:00',
      closing_hour: '22:00',
      informations: {
        capacity: 5,
        resources: ['Mesa'],
        description: 'Sala de estudos',
      },
    },
    {
      id: 3,
      name: 'Room 3',
      opening_hour: '13:30',
      closing_hour: '18:00',
      informations: {
        capacity: 40,
        resources: ['Projetor', 'Computador', 'Mesa', 'Cadeira'],
        description: 'Sala de aula',
      },
    },
  ]);
};

const seedHours = async (knex: Knex): Promise<void> => {
  await knex('hours').insert([
    {
      id: 1,
      room_id: 1,
      week_day: 1,
      opening: '08:00:00',
      closing: '09:00:00',
    },
    {
      id: 2,
      room_id: 1,
      week_day: 1,
      opening: '10:00:00',
      closing: '11:00:00',
    },
    {
      id: 3,
      room_id: 2,
      week_day: 2,
      opening: '14:00:00',
      closing: '15:00:00',
    },
    {
      id: 4,
      room_id: 2,
      week_day: 2,
      opening: '15:00:00',
      closing: '16:00:00',
    },
    {
      id: 5,
      room_id: 3,
      week_day: 1,
      opening: '12:00:00',
      closing: '13:00:00',
    },
    {
      id: 6,
      room_id: 3,
      week_day: 1,
      opening: '17:00:00',
      closing: '18:00:00',
    },
    {
      id: 7,
      room_id: 1,
      week_day: 2,
      opening: '12:00:00',
      closing: '13:00:00',
    },
    {
      id: 8,
      room_id: 2,
      week_day: 2,
      opening: '14:00:00',
      closing: '15:00:00',
    },
  ]);
};

const seedBookings = async (knex: Knex): Promise<void> => {
  await knex('bookings').insert([
    {
      id: 1,
      room_id: 1,
      hour_id: 1,
      user_id: 2,
      day: '2024-11-01',
      approved: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      deleted_at: null,
    },
    {
      id: 2,
      room_id: 1,
      hour_id: 2,
      user_id: 3,
      day: '2024-11-02',
      approved: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      deleted_at: null,
    },
    {
      id: 3,
      room_id: 1,
      hour_id: 3,
      user_id: null,
      day: '2024-11-03',
      approved: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      deleted_at: null,
    },
    {
      id: 4,
      room_id: 2,
      hour_id: 5,
      user_id: 3,
      day: '2024-11-01',
      approved: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      deleted_at: null,
    },
    {
      id: 5,
      room_id: 2,
      hour_id: 6,
      user_id: 2,
      day: '2024-11-02',
      approved: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      deleted_at: null,
    },
    {
      id: 6,
      room_id: 2,
      hour_id: 7,
      user_id: null,
      day: '2024-11-03',
      approved: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      deleted_at: null,
    },
    {
      id: 7,
      room_id: 3,
      hour_id: 8,
      user_id: 2,
      day: '2024-11-01',
      approved: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      deleted_at: null,
    },
    {
      id: 8,
      room_id: 3,
      hour_id: 1,
      user_id: 3,
      day: '2024-11-02',
      approved: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      deleted_at: null,
    },
    {
      id: 9,
      room_id: 3,
      hour_id: 2,
      user_id: null,
      day: '2024-11-03',
      approved: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
      deleted_at: null,
    },
  ]);
};


