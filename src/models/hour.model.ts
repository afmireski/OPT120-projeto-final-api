export interface HourModel {
  id: number;
  room_id: number;
  week_day: number;
  opening: string;
  closing: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
