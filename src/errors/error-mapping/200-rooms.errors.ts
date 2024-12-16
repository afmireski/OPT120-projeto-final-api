import { InternalMessage } from '../internal.error';

const errors: Record<number, InternalMessage> = {
  201: {
    message: 'Sala não encontrada',
    httpCode: 404,
  },
  202: {
    message: 'Houve um erro ao tentar criar uma sala',
    httpCode: 500,
  },
  203: {
    message: 'Houve um erro ao tentar buscar a sala',
    httpCode: 500,
  },
  204: {
    message: 'Houve um erro ao tentar atualizar a sala',
    httpCode: 500,
  },
  205: {
    message: 'Houve um erro ao tentar excluir a sala',
    httpCode: 500,
  },
  206: {
    message: 'Houve um erro ao tentar listar as salas',
    httpCode: 500,
  },
};

export default errors;
