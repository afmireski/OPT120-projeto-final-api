import { UserModel, UserRole } from '../models/users.model';

export interface LoginInput {
  email?: string;
  ra?: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  ra?: string;
  name: string;
  password: string;
  role: keyof typeof UserRole;
}

export type TokenUserData = Pick<UserModel, 'id' | 'email' | 'role'>;

export interface TokenPayload {
  user: TokenUserData;
}

export interface LoginResponse {
  id: number;
  token: string;
  email: string;
  user_role: keyof typeof UserRole;
}
