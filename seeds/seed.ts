import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  const PASSWORD = '$2a$10$krak09cAf0L0M/91/AzYieYSKNDvoz3yXW2Phl5HnOL8KUFQBUmBq';
  // Inserts seed entries
  await knex('users').insert([
    {
      email: "admin@email.com",
      password: PASSWORD,
      name: 'Admin',
      role: 'ADMIN',
    },
    {
        email: "student@email.com",
        password: PASSWORD,
        name: 'Student',
        role: 'STUDENT',
    },
    {
        email: "servant@email.com",
        password: PASSWORD,
        name: 'Servant',
        role: 'SERVANT',
    }
  ]);
}
