import type { ILesson } from "./lesson.interface";

export interface IChapter {
  id: number;
  title: string;
  description: string;
  image: string;
  images?: string[];
  status: boolean;
  position: number;
  lesson: ILesson;
  createdAt: string;
  updateAt: string;
  subchapters?: IChapter[];
}
