import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_NOTIFICATION_API_BASE_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Notifications"],
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => ({
                url: "notifications",
                method: "GET",
            }),
            providesTags: ["Notifications"],
        }),

        markAsRead: builder.mutation({
            query: (notificationId) => ({
                url: `notifications/${notificationId}/read`,
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),

        markAllAsRead: builder.mutation({
            query: () => ({
                url: "notifications/mark-all-read",
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),

        deleteNotification: builder.mutation({
            query: (notificationId) => ({
                url: `notifications/${notificationId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notifications"],
        }),

        clearAllNotifications: builder.mutation({
            query: () => ({
                url: "notifications/clear-all",
                method: "DELETE",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
    useClearAllNotificationsMutation,
} = notificationApi;
