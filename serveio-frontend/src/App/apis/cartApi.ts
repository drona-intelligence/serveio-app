import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_CART_API_BASE_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Cart"],
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => ({
                url: "cart",
                method: "GET",
            }),
            providesTags: ["Cart"],
        }),

        addToCart: builder.mutation({
            query: (data) => ({
                url: "cart/add",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Cart"],
        }),

        removeFromCart: builder.mutation({
            query: (itemId) => ({
                url: `cart/remove/${itemId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),

        updateCartItem: builder.mutation({
            query: ({ itemId, quantity }) => ({
                url: `cart/update/${itemId}`,
                method: "PUT",
                body: { quantity },
            }),
            invalidatesTags: ["Cart"],
        }),

        clearCart: builder.mutation({
            query: () => ({
                url: "cart/clear",
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useUpdateCartItemMutation,
    useClearCartMutation,
} = cartApi;
