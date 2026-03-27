import type { IUser, PaginatedResult, PaginationParams } from "@core/interfaces";
import { emptySplitApi } from "@infra/http";

const defaultPaginationParams: PaginationParams = {
  page: 1,
  limit: 10,
  enablePagination: true,
};

export const userApi = emptySplitApi.injectEndpoints?.({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResult<IUser>, PaginationParams | void>({
      query: (arg) => {
        const page = arg?.page ?? defaultPaginationParams.page;
        const limit = arg?.limit ?? defaultPaginationParams.limit;
        const enablePagination =
          arg?.enablePagination ?? defaultPaginationParams.enablePagination;
        
        return {
          url: "/users",
          method: "GET",
          params: { page, limit, enablePagination },
        };
      },
    }),
    getUserById: builder.query<IUser, string>({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),
    toggleUserActive: builder.mutation<IUser, { id: number; active: boolean }>({
      query: ({ id, active }) => ({
        url: `/users/${id}/active`,
        method: "PATCH",
        body: { active },
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useToggleUserActiveMutation,
} = userApi;
