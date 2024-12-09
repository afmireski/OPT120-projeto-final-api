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
