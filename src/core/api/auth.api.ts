import { emptySplitApi } from "@/infra/http";

export const authApi = emptySplitApi.injectEndpoints?.({
  endpoints: (builder) => ({
    login: builder.mutation<string, { email: string; password: string }>({
      query: (body) => ({
        body,
        method: "POST",
        url: "/auth/login",
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
