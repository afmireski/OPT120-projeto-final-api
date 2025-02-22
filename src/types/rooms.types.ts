import { FilterRelation, Pagination } from './types';

export interface UpdateRoomInput {
  name?: string;
  informations?: Record<string, unknown>;
  opening_hour?: Date;
  closing_hour?: Date;
}
export interface CreateRoomInput {
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

export interface Room {
  id: number;
  name: string;
  informations: Record<string, unknown>;
  opening_hour: string;
  closing_hour: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
