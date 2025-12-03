import type { ILesson } from "./lesson.interface";

export interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  lessons: ILesson[];
}
