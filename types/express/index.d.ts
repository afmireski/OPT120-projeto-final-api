import { TokenUserData } from "../../src/types/authentication.types";

declare module 'express-serve-static-core' {
  interface Request {
      user?: TokenUserData
  }
}