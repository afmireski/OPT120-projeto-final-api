import { InternalError } from '../errors/internal.error';
import {
  LoginInput,
  LoginResponse,
  TokenPayload,
} from '../types/authentication.types';
import { generateToken } from '../utils/jwt.utils';
import { KnexService } from './knex.service';

import * as bcrypt from 'bcrypt';

export const login = async (input: LoginInput): Promise<LoginResponse> => {
  const { email, ra, password } = input;

  if (!email && !ra) {
    throw new InternalError(1, ['email or ra is required']);
  }

  const credential = email ?? ra;

  const knex = KnexService.getInstance().knex;

  const user = await knex('users')
    .select('*')
    .where((qb) => {
      return qb.where('email', credential).orWhere('ra', credential);
    })
    .whereNull('deleted_at')
    .first();

  if (!user) {
    throw new InternalError(2);
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new InternalError(2);
  }

  const { id, email: userEmail, role } = user;

  const payload: TokenPayload = {
    user: {
      id,
      email: userEmail,
      role,
    },
  };

  const token = generateToken(payload);

  return {
    email: userEmail,
    user_role: role,
    token,
  };
};
