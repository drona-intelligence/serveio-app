import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import type { ApiResponse } from "@/types/types";

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
        getAllOrders: builder.query<any, void>({
            query: () => ({
                url: "orders",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<any>) => response.data,
            providesTags: ["Orders"],
        }),

        getAdminOrders: builder.query<any, void>({
            query: () => ({
                url: "orders/all",
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<any>) => response.data,
            providesTags: ["Orders"],
        }),

        getOrderById: builder.query<any, string>({
            query: (orderId) => ({
                url: `orders/${orderId}`,
                method: "GET",
            }),
            transformResponse: (response: ApiResponse<any>) => response.data,
            providesTags: ["Orders"],
        }),

        createOrder: builder.mutation<any, any>({
            query: (data) => ({
                url: "orders",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: ApiResponse<any>) => response.data,
            invalidatesTags: ["Orders"],
        }),

        updateOrder: builder.mutation<any, { orderId: string; data: any }>({
            query: ({ orderId, data }) => ({
                url: `orders/${orderId}/status`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: ApiResponse<any>) => response.data,
            invalidatesTags: ["Orders"],
        }),

        cancelOrder: builder.mutation<any, string>({
            query: (orderId) => ({
                url: `orders/${orderId}/status`,
                method: "PUT",
                body: { status: "CANCELLED" },
            }),
            transformResponse: (response: ApiResponse<any>) => response.data,
            invalidatesTags: ["Orders"],
        }),
    }),
});

export const {
    useGetAllOrdersQuery,
    useGetAdminOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useCancelOrderMutation,
} = orderApi;
