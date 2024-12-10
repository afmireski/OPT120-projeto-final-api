import { InternalError } from '../errors/internal.error';
import { RegisterAdminInput } from '../types/users.types';
import { hashText } from '../utils/hash.utils';
import { KnexService } from './knex.service';

export const registerAdmin = (input: RegisterAdminInput) => {
  const { email, password, name } = input;

  const knex = KnexService.getInstance().knex;

  const hashPassword = hashText(password, 10);

  return knex('users')
    .insert({
      email,
      password: hashPassword,
      name,
      role: 'ADMIN',
    })
    .catch((error) => {
      throw new InternalError(102, error.message);
    });
};

export const findUserById = (id: number) => {
  const knex = KnexService.getInstance().knex;

  const query = knex({ u: 'users' })
    .select({
      id: 'u.id',
      email: 'u.email',
      name: 'u.name',
      ra: 'u.ra',
      role: 'u.role',
      created_at: 'u.created_at',
    })
    .where('id', id)
    .first();

  return query
    .then((user) => {
      if (!user) {
        throw new InternalError(101);
      }

      return user;
    })
    .catch((error) => {
      if (error instanceof InternalError) {
        throw error;
      }

      throw new InternalError(103, error.message);
    });
};
