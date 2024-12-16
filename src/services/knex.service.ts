import knex, { Knex } from 'knex';
import { FilterRelation, Filters, Pagination } from '../types/types';

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

  static getInstance(): KnexService {
    if (!this.instance) {
      throw new Error('KnexService is not initialized');
    }

    return this.instance;
  }

  static addPaginationToQuery(
    query: Knex.QueryBuilder,
    pagination?: Pagination,
  ) {
    if (!pagination) {
      return;
    }
    query.limit(pagination.limit ?? 20).offset(pagination.offset ?? 0);
  }

  static appendFiltersToQuery(query: Knex.QueryBuilder, filters?: Filters) {
    if (!filters) {
      return;
    }
    Object.entries(filters).forEach(([key, value]) => {
      this.appendQuery(query, key, value);
    });
  }

  private static appendQuery(
    query: Knex.QueryBuilder,
    key: string,
    relation: FilterRelation<any>,
  ) {
    Object.keys(relation).forEach((filter) => {
      const rel = filter as keyof FilterRelation<any>;
      const operator = this.extractFilterOperator(rel);

      if (operator === 'like') {
        query.whereLike(key, `%${relation[rel]}%`);
      } else if (operator === 'in') {
        query.whereIn(key, relation[rel]);
      } else if (operator === 'not in') {
        query.whereNotIn(key, relation[rel]);
      } else {
        query.where(key, operator, relation[rel]);
      }
    });
  }

  private static extractFilterOperator(
    operator: keyof FilterRelation<unknown>,
  ) {
    switch (operator) {
      case 'eq':
        return '=';
      case 'ne':
        return '<>';
      case 'in':
        return 'in';
      case 'nin':
        return 'not in';
      case 'like':
        return 'like';
      case 'gte':
        return '>=';
      case 'gt':
        return '>';
      case 'lte':
        return '<=';
      case 'lt':
        return '<';
    }
  }
}
