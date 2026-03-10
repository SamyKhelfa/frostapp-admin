import { ILoginPayload, ILoginResponse } from "@core/interfaces";
import { emptySplitApi } from "@infra/http";

export const authApi = emptySplitApi.injectEndpoints?.({
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponse, ILoginPayload>({
      query: (body: ILoginPayload) => ({
        body,
        method: "POST",
        url: "/auth/login",
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
