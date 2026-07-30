import type { ISubchapter } from "@core/interfaces";
import { emptySplitApi } from "@infra/http";

/** Charge utile d'écriture d'un sous-chapitre (SubChapter côté API). */
export type SubChapterPayload = {
  title: string;
  description: string;
  video: string;
  duration: number;
  position: number;
  status: boolean;
  active: boolean;
  chapterId?: number;
};

export const subChapterApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubChapter: builder.mutation<ISubchapter, SubChapterPayload>({
      query: (body) => ({
        url: "/subchapters",
        method: "POST",
        body,
      }),
      // Un sous-chapitre se lit via son chapitre (GET /chapters/:id) et compte
      // dans la vue du cours : les deux caches doivent tomber.
      invalidatesTags: ["Chapters", "Lessons"],
    }),
    updateSubChapter: builder.mutation<
      ISubchapter,
      { id: number; body: Partial<SubChapterPayload> }
    >({
      query: ({ id, body }) => ({
        url: `/subchapters/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Chapters", "Lessons"],
    }),
    deleteSubChapter: builder.mutation<void, number>({
      query: (id) => ({
        url: `/subchapters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chapters", "Lessons"],
    }),
  }),
});

export const {
  useCreateSubChapterMutation,
  useUpdateSubChapterMutation,
  useDeleteSubChapterMutation,
} = subChapterApi;
