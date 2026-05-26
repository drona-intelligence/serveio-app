import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse, MenuItem } from "@/types/types";

export const menuItemsApi = createApi({
    reducerPath: "menuItemsApi",

    baseQuery: fetchBaseQuery({
                baseUrl: `${import.meta.env.VITE_RESTAURANT_API_BASE_URL}`,
    }),

    tagTypes: ["MenuItems"],

    endpoints: (builder) => ({

        getMenuItemsForCategory: builder.query<
            ApiResponse<MenuItem[]>,
            string
        >({
            query: (categoryId) => ({
                url: `items/categories/${categoryId}/items`,
                method: "GET",
            }),
            providesTags: ["MenuItems"],
        }),

        getMenuItemById: builder.query<
            ApiResponse<MenuItem>,
            string
        >({
            query: (id) => ({
                url: `items/${id}`,
                method: "GET",
            }),
            providesTags: ["MenuItems"],
        }),


    }),
});

export const {
    useGetMenuItemsForCategoryQuery,
    useGetMenuItemByIdQuery,
} = menuItemsApi;