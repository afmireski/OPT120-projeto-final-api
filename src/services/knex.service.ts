import knex, { Knex } from 'knex';

export class KnexService {
  private static instance: KnexService;
  readonly knex: Knex;

  private constructor(private readonly config: Knex.Config) {
    this.knex = knex(this.config);
  }

  static create(config: Knex.Config) {
    if (!this.instance) {
      this.instance = new KnexService(config);
    }

    return this.instance;
  }

  static getInstance() {
    if (!this.instance) {
      throw new Error('KnexService is not initialized');
    }

    return this.instance;
  }
}
