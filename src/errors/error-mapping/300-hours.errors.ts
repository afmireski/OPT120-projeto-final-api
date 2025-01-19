import { InternalMessage } from '../internal.error';

const errors: Record<number, InternalMessage> = {
  301: {
    message: 'Nenhum horário encontrado',
    httpCode: 404,
  },
  302: {
    message: 'Houve um erro ao tentar cadastrar os horários',
    httpCode: 500,
  },
  303: {
    message: 'Houve um erro ao tentar buscar os horários',
    httpCode: 500,
  },
  304: {
    message: 'Houve um erro ao tentar remover os horários',
    httpCode: 500,
  },
  305: {
    message: 'Nenhum dos horários informados é válido',
    httpCode: 400,
  },
};

export default errors;
