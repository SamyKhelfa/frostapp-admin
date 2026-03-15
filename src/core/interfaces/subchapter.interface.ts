import { type IChapter } from "./chapter.interface";

export interface ISubchapter {
  id: number;
  title: string;
  description: string;
  video: string;
  duration: number;
  active: boolean;
  position: number;
  chapter: IChapter;
  status: boolean;
}
