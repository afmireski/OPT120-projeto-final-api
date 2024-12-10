import { InternalError } from '../errors/internal.error';
import { RegisterInput } from '../types/authentication.types';
import { AlterUserInput, RegisterAdminInput } from '../types/users.types';
import { hashText } from '../utils/hash.utils';
import { KnexService } from './knex.service';

import * as bcrypt from 'bcrypt';

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

export const register = async (input: RegisterInput): Promise<void> => {
  const knex = KnexService.getInstance().knex;
  const { password, ...data } = input;
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  await Promise.resolve(
    knex('users').insert({
      ...data,
      password: hashPassword,
    }),
  ).catch((error) => {
    throw new InternalError(102, error.message);
  });
};

export const alterUser = async (
  input: AlterUserInput,
  x: number,
): Promise<void> => {
  const { password, ...rest } = input;
  const knex = KnexService.getInstance().knex;
  const data = rest;

  if (password) {
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    Object.assign(data, { password: hashPassword });
  }

  if (Object.keys(data).length === 0) return;

  await Promise.resolve(knex('users').update(data).where('id', x)).catch(
    (error) => {
      throw new InternalError(102, error.message);
    },
  );
};
