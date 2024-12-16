import { TokenUserData } from '../../src/types/authentication.types';
import { Filters, Pagination } from '../../src/types/types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: TokenUserData;
    filters?: Filters;
    pagination?: Pagination;
  }
}

interface X extends Record<string, any> {}
