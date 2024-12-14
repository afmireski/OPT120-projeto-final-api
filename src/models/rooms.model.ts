export interface RoomModel {
  id: number;
  name: string;
  opening_hour: Date;
  closing_hour: Date;
  informations: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface Room extends Omit<RoomModel, 'updated_at' | 'deleted_at'> {}
