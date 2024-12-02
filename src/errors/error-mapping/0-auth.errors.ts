import { InternalMessage } from '../internal.error';

const errors: Record<number, InternalMessage> = {
  1: {
    message: 'Invalid input',
    httpCode: 400,
  },
};

export default errors;
