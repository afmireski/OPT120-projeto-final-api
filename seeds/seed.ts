import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await Promise.all([seedUsers(knex), seedRooms(knex), seedHours(knex)]);
}

const seedUsers = async (knex: Knex): Promise<void> => {
  await knex('users').del();

  const PASSWORD =
    '$2a$10$krak09cAf0L0M/91/AzYieYSKNDvoz3yXW2Phl5HnOL8KUFQBUmBq';
  await knex('users').insert([
    {
      email: 'admin@email.com',
      password: PASSWORD,
      name: 'Admin',
      role: 'ADMIN',
    },
    {
      email: 'student@email.com',
      password: PASSWORD,
      ra: '1234567',
      name: 'Student',
      role: 'STUDENT',
    },
    {
      email: 'servant@email.com',
      password: PASSWORD,
      name: 'Servant',
      role: 'SERVANT',
    },
  ]);
};

const seedRooms = async (knex: Knex): Promise<void> => {
  await knex('rooms').del();

  await knex('rooms').insert([
    {
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
  await knex('hours').del();

  await knex('hours').insert([
    {
      room_id: 1,
      week_day: 1,
      opening: '08:00:00',
      closing: '09:00:00',
    },
    {
      room_id: 1,
      week_day: 1,
      opening: '10:00:00',
      closing: '11:00:00',
    },
    {
      room_id: 1,
      week_day: 2,
      opening: '14:00:00',
      closing: '15:00:00',
    },
    {
      room_id: 1,
      week_day: 2,
      opening: '15:00:00',
      closing: '16:00:00',
    },
    {
      room_id: 2,
      week_day: 1,
      opening: '12:00:00',
      closing: '13:00:00',
    },
    {
      room_id: 2,
      week_day: 1,
      opening: '17:00:00',
      closing: '18:00:00',
    },
    {
      room_id: 2,
      week_day: 2,
      opening: '12:00:00',
      closing: '13:00:00',
    },
    {
      room_id: 2,
      week_day: 2,
      opening: '14:00:00',
      closing: '15:00:00',
    },
  ]);
};
