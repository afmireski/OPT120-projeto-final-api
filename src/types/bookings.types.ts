import { UserRole } from '../models/users.model';
import { FilterRelation, Pagination } from './types';

export enum BookingState {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

export interface Booking {
  id: number;
  room_id: number;
  hour_id: number;
  user_id: number;
  day: string;
  state: keyof typeof BookingState;
  approved_at?: string | null;
  rejected_at?: string | null;
  canceled_at?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
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
  date: FilterRelation<string>;
  state: FilterRelation<keyof typeof BookingState>;
};

export interface ListRoomBookingsInput {
  room_id: number;
  filter?: Omit<ListBookingsFilters, 'b.room_id'>;
  pagination?: Pagination;
}

export interface CreateBookingIntentInput {
  user_id: number;
  room_id: number;
  hour_id: number;
  date: Date;
  user_role: keyof typeof UserRole;
}

export type ListBookingsFilters = {
  'b.id'?: FilterRelation<number>;
  'b.name'?: FilterRelation<string>;
  'b.day'?: FilterRelation<string>;
  'b.state'?: FilterRelation<keyof typeof BookingState>;
  'b.room_id'?: FilterRelation<number>;
  'u.name'?: FilterRelation<string>;
  'u.email'?: FilterRelation<string>;
  'u.ra'?: FilterRelation<string>;
  'b.hour_id'?: FilterRelation<number>;
  'h.week_day'?: FilterRelation<number>;
  'u.role'?: FilterRelation<keyof typeof UserRole>;
};

export interface ListBookingsInput {
  filter?: ListBookingsFilters;
  pagination?: Pagination;
}
