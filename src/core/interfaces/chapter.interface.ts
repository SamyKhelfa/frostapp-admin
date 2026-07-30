import type { ILesson } from "./lesson.interface";
import type { ISubchapter } from "./subchapter.interface";

/** Un « chapitre » dans le vocabulaire de l'admin. */
export interface IChapter {
  id: number;
  title: string;
  description: string;
  image: string;
  images?: string[];
  status: boolean;
  position: number;
  lesson: ILesson;
  lessonId?: number;
  createdAt: string;
  updateAt: string;
  /** Nom de la relation tel que renvoyé par Prisma. */
  SubChapter?: ISubchapter[];
}
