import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_ORDER_API_BASE_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Orders"],
    endpoints: (builder) => ({
        getAllOrders: builder.query({
            query: () => ({
                url: "orders",
                method: "GET",
            }),
            providesTags: ["Orders"],
        }),

        getOrderById: builder.query({
            query: (orderId) => ({
                url: `orders/${orderId}`,
                method: "GET",
            }),
            providesTags: ["Orders"],
        }),

        createOrder: builder.mutation({
            query: (data) => ({
                url: "orders",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        updateOrder: builder.mutation({
            query: ({ orderId, data }) => ({
                url: `orders/${orderId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Orders"],
        }),

        cancelOrder: builder.mutation({
            query: (orderId) => ({
                url: `orders/${orderId}/cancel`,
                method: "PUT",
            }),
            invalidatesTags: ["Orders"],
        }),
    }),
});

export const {
    useGetAllOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useCancelOrderMutation,
} = orderApi;
