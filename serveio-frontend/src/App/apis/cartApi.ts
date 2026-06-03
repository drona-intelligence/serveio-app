import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: baseQueryWithAuth(`${import.meta.env.VITE_CART_API_BASE_URL}`),
    tagTypes: ["Cart"],
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => ({
                url: "cart/items",
                method: "GET",
            }),
            providesTags: ["Cart"],
        }),

        addToCart: builder.mutation({
            query: (data) => ({
                url: "cart/items",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Cart"],
        }),

        removeFromCart: builder.mutation({
            query: (itemId) => ({
                url: `cart/items/${itemId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),

        updateCartItem: builder.mutation({
            query: ({ itemId, quantity }) => ({
                url: `cart/items/${itemId}`,
                method: "PUT",
                body: { quantity },
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
} = cartApi;
