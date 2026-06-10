import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState } from "../store/store";
import { clearCredentials } from "../slices/authslice";

export const baseQueryWithAuth = (baseUrl: string): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      api.dispatch(clearCredentials());
    }

    return result;
  };
};
