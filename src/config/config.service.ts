import { config } from 'dotenv';
import { InternalError } from '../errors/internal.error';

export class ConfigService {
  private static instance: ConfigService;

  private env;

  private constructor() {
    switch (process.env.NODE_ENV) {
      case 'production':
        config({ path: '.env.production' });
      case 'development':
        config({ path: '.env.development' });
      case 'local':
      default:
        config({ path: '.env' });
    }

    this.env = process.env;
  }

  static create(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  get(key: string): any {
    const value = this.env[key];
    try {
      if (!value) {
        throw new InternalError(0, [`Missing environment variable: ${key}`]);
      }

      return JSON.parse(value);
    } catch (error) {
      return value; // Unnecessary parse
    }
  }
}
