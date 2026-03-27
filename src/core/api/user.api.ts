import type { IUser } from "@core/interfaces";
import { emptySplitApi } from "@infra/http";

export const userApi = emptySplitApi.injectEndpoints?.({
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
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
