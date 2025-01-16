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
};

export default errors;
