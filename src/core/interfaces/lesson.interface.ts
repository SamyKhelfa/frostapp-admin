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

/**
 * Charge utile de POST /lessons/full : l'arborescence complète d'un cours.
 * Rappel du vocabulaire : cours = Lesson, chapitre = Chapter,
 * sous-chapitre = SubChapter. Tout ce qui est optionnel est défaulté par le back.
 */
export interface ISubChapterPayload {
  title: string;
  description?: string;
  video?: string;
  duration?: number;
  status?: boolean;
  active?: boolean;
  position?: number;
}

export interface IChapterPayload {
  title: string;
  description?: string;
  image?: string;
  status?: boolean;
  position?: number;
  subChapters?: ISubChapterPayload[];
}

export interface ILessonFullPayload {
  title: string;
  description: string;
  users?: number[];
  chapters?: IChapterPayload[];
}
