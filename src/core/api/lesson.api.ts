import {
  PaginatedResult,
  PaginationParams,
  type ILesson,
  type ILessonFullPayload,
} from "@core/interfaces";
import { emptySplitApi } from "@infra/http";

const defaultPaginationParams = {
  page: 1,
  limit: 10,
  enablePagination: true,
};

export const lessonApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getLessons: builder.query<
      PaginatedResult<ILesson>,
      PaginationParams | void
    >({
      query: (arg) => {
        const page = arg?.page ?? defaultPaginationParams.page;
        const limit = arg?.limit ?? defaultPaginationParams.limit;
        const enablePagination =
          arg?.enablePagination ?? defaultPaginationParams.enablePagination;

        return {
          url: "/lessons",
          method: "GET",
          params: { page, limit, enablePagination },
        };
      },
      providesTags: ["Lessons"],
    }),
    getLessonById: builder.query<ILesson, string>({
      query: (id: string) => ({
        url: `/lessons/${id}`,
        method: "GET",
      }),
    }),
    createLesson: builder.mutation<ILesson, Partial<ILesson>>({
      query: (body) => ({
        url: "/lessons",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Lessons"],
    }),
    /**
     * Crée l'arborescence complète en une requête : le cours (Lesson), ses
     * chapitres (Chapter) et leurs sous-chapitres (SubChapter), dans une transaction.
     */
    createLessonFull: builder.mutation<ILesson, ILessonFullPayload>({
      query: (body) => ({
        url: "/lessons/full",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Lessons", "Chapters"],
    }),
    /**
     * Mise à jour partielle d'un cours. Le back expose un PUT, mais ignore les
     * champs absents du payload : envoyer { title } ne touche pas la description.
     */
    updateLesson: builder.mutation<
      ILesson,
      { id: number; data: Partial<Pick<ILesson, "title" | "description">> }
    >({
      query: ({ id, data }) => ({
        url: `/lessons/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Lessons"],
    }),
    deleteLesson: builder.mutation<void, number>({
      query: (id) => ({
        url: `/lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lessons"],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useGetLessonByIdQuery,
  useCreateLessonMutation,
  useCreateLessonFullMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApi;
