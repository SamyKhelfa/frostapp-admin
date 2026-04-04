import { type ILesson } from "@core/interfaces";
import { emptySplitApi } from "@infra/http";

export const lessonApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getLessons: builder.query<ILesson[], void>({
      query: () => ({
        url: "/lessons",
        method: "GET",
      }),
    }),
    getLessonById: builder.query<ILesson, string>({
      query: (id: string) => ({
        url: `/lessons/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetLessonsQuery, useGetLessonByIdQuery } = lessonApi;
