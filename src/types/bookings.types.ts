import { FilterRelation, Pagination } from "./types";

export interface Booking {
  id: number;
  room_id: number;
  hour_id: number;
  user_id?: number;
  day: string;
  approved: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type ListBookingsFilters = {
  id: FilterRelation<number>;
  name: FilterRelation<string>;
};

export interface ListBookingsInput {
  filter?: ListBookingsFilters;
  pagination?: Pagination;
}
