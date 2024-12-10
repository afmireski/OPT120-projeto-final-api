import { InternalError } from '../errors/internal.error';
import { RegisterInput } from '../types/authentication.types';
import { KnexService } from '../services/knex.service';

import * as bcrypt from 'bcrypt';
import { AlterUserInput } from '../types/users.types';

export const register = async (input: RegisterInput): Promise<void> => {
  const { email, ra, password, user_role } = input;

  if (!email) {
    throw new InternalError(1, ['email is required']);
  }
  if (!ra) {
    throw new InternalError(1, ['ra is required']);
  }
  if (!password) {
    throw new InternalError(1, ['password is required']);
  }

  const knex = KnexService.getInstance().knex;

  Promise.resolve(
    knex('users').insert({
      email: email,
      ra: ra,
      user_role: user_role,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
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
    const p = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    Object.assign(data, { password: p });
  }

  Promise.resolve(knex('users').update(data).where('id', x)).catch((error) => {
    throw new InternalError(102, error.message);
  });
};
