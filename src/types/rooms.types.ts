export interface UpdateRoomInput {
  name?: string;
  informations?: Record<string, unknown>;
  opening_hour?: Date;
  closing_hour?: Date;
}
