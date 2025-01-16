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
