import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const IS_DEV = true;

const devUrl = "http://localhost:3000";
const prodUrl = "http://localhost:3000";

const apiUrl = IS_DEV ? devUrl : prodUrl;

const baseQueryWithReauth =
  (baseQueryOptions: Parameters<typeof fetchBaseQuery>[0]) =>
  async (
    args: Parameters<ReturnType<typeof fetchBaseQuery>>[0],
    api: Parameters<ReturnType<typeof fetchBaseQuery>>[1],
    extraOptions: Parameters<ReturnType<typeof fetchBaseQuery>>[2],
  ) => {
    const result = await fetchBaseQuery(baseQueryOptions)(
      args,
      api,
      extraOptions,
    );

    const isAuthLogin =
      typeof args === "object" &&
      args !== null &&
      "url" in args &&
      (args as { url: string }).url.includes("/auth/login");

    if (
      !isAuthLogin &&
      (result?.error?.status === 401 || result?.error?.status === 403)
    ) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");
      window.location.reload();
    }

    return result;
  };


export const emptySplitApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth({
    baseUrl: apiUrl,
    prepareHeaders: async (headers: Headers) => {
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
  endpoints: () => ({}),
});


