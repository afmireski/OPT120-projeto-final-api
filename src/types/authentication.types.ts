import { UserModel, UserRole } from '../models/users.model';

export interface LoginInput {
  email?: string;
  ra?: string;
  password: string;
}

export type TokenUserData = Pick<UserModel, 'id' | 'email' | 'role'>;

export interface TokenPayload {
  user: TokenUserData;
}

export interface LoginResponse {
  token: string;
  email: string;
  user_role: keyof typeof UserRole;
}
