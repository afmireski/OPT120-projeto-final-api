import { InternalMessage } from '../internal.error';

const errors: Record<number, InternalMessage> = {
  101: {
    message: 'Usuário não encontrado',
    httpCode: 404,
  },
  102: {
    message: 'Houve um erro ao tentar criar o usuário',
    httpCode: 500,
  },
  103: {
    message: 'Houve um erro ao tentar buscar o usuário',
    httpCode: 500,
  },
};

export default errors;
