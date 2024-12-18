import { FilterRelation, Pagination } from './types';

export interface UpdateRoomInput {
  name?: string;
  informations?: Record<string, unknown>;
  opening_hour?: Date;
  closing_hour?: Date;
}
export interface createRoomInput {
  name: string;
  informations?: Record<string, unknown>;
  opening_hour: Date;
  closing_hour: Date;
}


export type ListRoomsFilters = {
  id: FilterRelation<number>;
  name: FilterRelation<string>;
};

export interface ListRoomsInput {
  filter?: ListRoomsFilters;
  pagination?: Pagination;
}
