export interface TimeInterval {
  opening: string;
  closing: string;
}

export interface OccupiedInterval extends TimeInterval {
  id: number;
}

export interface AvailabilityHours {
  room_id: number;
  day_of_week: number;
  free_intervals: TimeInterval[];
  occupied_intervals: OccupiedInterval[];
}

export interface NewHourData {
  day_of_week: number;
  opening: string;
  closing: string;
}

export interface CreateHoursInput {
  room_id: number;
  data: NewHourData[];
}
