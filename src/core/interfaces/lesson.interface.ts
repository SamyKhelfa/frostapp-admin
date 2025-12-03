import type { IUser } from "./user.interface";
import type { IChapter } from "./chapter.interface";

export interface ILesson {
  id: number;
  title: string;
  description: string;
  users: IUser[];
  chapters: IChapter[];
  createdAt: string;
  updateAt: string;
}
