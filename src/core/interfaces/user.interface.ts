import type { ILesson } from "./lesson.interface";

export interface IUser {
  id: number;
  email: string;
  name: string;
  password?: string;
  role?: string;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
  lessons?: ILesson[];
}
