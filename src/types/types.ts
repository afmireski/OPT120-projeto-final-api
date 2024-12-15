export enum ExtraFields {
  filters,
  pagination,
}

export type Filters = Record<string, FilterRelation<unknown>>;

export interface FilterRelation<T> {
  eq?: T;
  ne?: T;
  in?: T[];
  nin?: T[];
  like?: T;
  gte?: T;
  gt?: T;
  lte?: T;
  lt?: T;
}

export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface Pagination extends PaginationQuery {
  offset: number;
}

export interface Metadata {
  total: number;
  page?: number;
  limit?: number;
}

export interface MetadataArray<T> {
  metadata: Metadata;
  data: Array<T>;
}
