export interface UserModel {
  id: number;
  email: string;
  ra?: string;
  password: string;
  role: keyof typeof UserRole;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export enum UserRole {
  ADMIN,
  STUDENT,
  SERVANT,
}
