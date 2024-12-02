import {
  LoginInput,
  LoginResponse,
  TokenPayload,
} from '../types/authentication.types';
import { KnexService } from './knex.service';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export const login = async (input: LoginInput): Promise<LoginResponse> => {
  const { email, ra, password } = input;

  const knex = KnexService.getInstance().knex;

  const user = await knex('users')
    .select('*')
    .where((qb) => {
      return qb.where('email', email).orWhere('ra', ra);
    })
    .whereNull('deleted_at')
    .first();

  if (!user) {
    throw new Error('User not found');
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  const { id, email: userEmail, role } = user;

  const payload: TokenPayload = {
    user: {
      id,
      email: userEmail,
      role,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return {
    email: userEmail,
    user_role: role,
    token,
  };
};
