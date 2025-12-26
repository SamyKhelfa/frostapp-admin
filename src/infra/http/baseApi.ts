import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const IS_DEV = true;

const devUrl = "http://localhost:3000";
const prodUrl = "http://localhost:3000";

const apiUrl = IS_DEV ? devUrl : prodUrl;

const baseQueryWithReauth = (baseQueryOptions: any) => async (args: any, api; any, extraOptions: any): Promise<any> => {
    const result: any = await fetchBaseQuery(baseQueryOptions)(
      args,
      api,
      extraOptions,
    );

    if(result?.error?.status === 401 || result?.error?.status === 403) {
        localStorage.removeItem("auth-token")

        window.location.href = "/"
        window.location.reload()
    }
}

export const emptySplitApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth({
    baseUrl: apiUrl,
    prepareHeadears: async (headers: Headers) => {
        try {
            const authToken = JSON.parse(
                localStorage.getItem("auth-token") || ""
            )

            if(authToken) {
                headers.set("Authorization", `Bearer ${authToken}`)
            }

            return headers
        } catch (err) {
            console.log(err)
        }
    }
  }),
  endpoints: (builder) => ({}),
});


