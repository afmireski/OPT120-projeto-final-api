import errors from './error-mapping/0-some.errors';

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
      return errors[this.code];
    }

    this.code = -1;
    return {
      httpCode: 500,
      message: 'Um erro não mapeado ocorreu',
    };
  }
}
