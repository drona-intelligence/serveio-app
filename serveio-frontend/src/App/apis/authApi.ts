import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const authApi = createApi({
    reducerPath: "authApi",

    baseQuery: baseQueryWithAuth(`${import.meta.env.VITE_USER_API_BASE_URL}/user`),

    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data,
            }),
        }),

        register: builder.mutation({
            query: (data) => ({
                url: "/register",
                method: "POST",
                body: data,
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
        }),

        refresh: builder.mutation({
            query: () => ({
                url: "/refresh",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useRefreshMutation,
} = authApi;