import { FilterRelation, Pagination } from './types';

export enum BookingState {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export interface Booking {
  id: number;
  room_id: number;
  hour_id: number;
  user_id?: number;
  day: string;
  state: keyof typeof BookingState;
  approved_at?: string | null;
  rejected_at?: string | null;
  canceled_at?: string | null;
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

export interface ListRoomBookingsInput {
  filter?: ListBookingsFilters;
  pagination?: Pagination;
}

export interface ListBookingHour {
  week_day: string;
  opening: string;
  closing: string;
}

export interface ListBookingRoom {
  name: string;
  informations: Record<string, unknown>;
  opening_hour: string;
  closing_hour: string;
}

export interface ListBookingUser {
  name: string;
  email: string;
  ra: string;
  role: string;
}

export interface ListBooking extends Booking {
  hour: ListBookingHour;
  room: ListBookingRoom;
  user?: ListBookingUser | null;
}

export type ListRoomBookingsFilters = {
  id: FilterRelation<number>;
  name: FilterRelation<string>;
};

export interface ListRoomBookingsInput {
  room_id: number;
  filter?: ListRoomBookingsFilters;
  pagination?: Pagination;
}
