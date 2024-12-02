import { InternalMessage } from '../internal.error';

const errors: Record<number, InternalMessage> = {
  1: {
    message: 'Invalid input',
    httpCode: 400,
  },
  2: {
    message: 'Credenciais Inválidas',
    httpCode: 401,
  },
};

export default errors;
