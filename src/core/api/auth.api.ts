import { ILoginPayload, ILoginResponse, IUser } from "@core/interfaces";
import { emptySplitApi } from "@infra/http";

export const authApi = emptySplitApi.injectEndpoints?.({
  endpoints: (builder) => ({
    me: builder.query<IUser, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
    login: builder.mutation<ILoginResponse, ILoginPayload>({
      query: (body: ILoginPayload) => ({
        body,
        method: "POST",
        url: "/auth/login",
      }),
    }),
  }),
});

export const { useLoginMutation, useMeQuery } = authApi;
