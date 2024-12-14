import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await Promise.all([seedUsers(knex), seedRooms(knex)]);
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
      ra: "1234567",
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
