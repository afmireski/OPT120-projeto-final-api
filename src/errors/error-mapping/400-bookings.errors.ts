import { InternalMessage } from '../internal.error';

const errors: Record<number, InternalMessage> = {
  401: {
    message: 'Nenhuma reserva encontrada',
    httpCode: 404,
  },
  402: {
    message: 'Houve um erro ao tentar cadastrar as reservas',
    httpCode: 500,
  },
  403: {
    message: 'Houve um erro ao tentar buscar as reservas',
    httpCode: 500,
  },
  404: {
    message: 'Houve um erro ao tentar remover a reserva',
    httpCode: 500,
  },
  405: {
    message: 'Não foi possível aprovar a reserva',
    httpCode: 400,
  },
};

export default errors;
