import {
  PaginatedResult,
  PaginationParams,
  type IChapter,
} from "@core/interfaces";
import { emptySplitApi } from "@infra/http";

export const defaultPaginationParams = {
  page: 1,
  limit: 10,
  enablePagination: true,
};

export const chapterApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getChapters: builder.query<
      PaginatedResult<IChapter>,
      PaginationParams | void
    >({
      query: (arg) => {
        const page = arg?.page ?? defaultPaginationParams.page;
        const limit = arg?.limit ?? defaultPaginationParams.limit;
        const enablePagination =
          arg?.enablePagination ?? defaultPaginationParams.enablePagination;

        return {
          url: "/chapters",
          method: "GET",
          params: { page, limit, enablePagination },
        };
      },
    }),
    getChapterById: builder.query<IChapter, string>({
      query: (id: string) => ({
        url: `/chapters/${id}`,
        method: "GET",
      }),
    }),
    createChapter: builder.mutation<IChapter, Partial<IChapter>>({
      query: (body) => ({
        url: "/chapters",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetChaptersQuery,
  useGetChapterByIdQuery,
  useCreateChapterMutation,
} = chapterApi;
