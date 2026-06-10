import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithAuth(`${import.meta.env.VITE_USER_API_BASE_URL}/user`),
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