import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/authentication.types';

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET ?? 'secret', {
    expiresIn: JWT_EXPIRES_IN ?? '1h',
  });
}

export function verifyToken(token: string): TokenPayload | undefined {
  const jwtResponse = jwt.verify(token, JWT_SECRET ?? 'secret');

  // Se volta uma string, tem algo de errado com o payload
  if (typeof jwtResponse === 'string') return undefined;

  return jwtResponse as TokenPayload;
}
