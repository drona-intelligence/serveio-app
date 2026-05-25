import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_USER_API_BASE_URL}/user`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => ({
                url: "/me",
                method: "GET",
            }),
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/updateprofile",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;