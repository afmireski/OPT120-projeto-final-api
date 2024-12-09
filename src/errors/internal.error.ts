import authErrors from './error-mapping/0-auth.errors';
import usersErrors from './error-mapping/100-users.errors';

export type InternalMessage = {
  httpCode: number;
  message: string;
};

export class InternalError {
  httpCode: number;
  message: string;

  constructor(
    public code: number,
    private readonly details?: string[],
  ) {
    const handling = this.errorHandler();

    this.httpCode = handling?.httpCode;
    this.message = handling?.message;
  }

  private errorHandler(): InternalMessage {
    if (this.code === 0) {
      return {
        httpCode: 500,
        message: 'Um erro inesperado ocorreu',
      };
    } else if (this.code < 100) {
      return authErrors[this.code];
    } else if (this.code < 200) {
      return usersErrors[this.code];
    }

    this.code = -1;
    return {
      httpCode: 500,
      message: 'Um erro não mapeado ocorreu',
    };
  }
}
