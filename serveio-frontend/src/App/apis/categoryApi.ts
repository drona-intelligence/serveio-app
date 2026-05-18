import type { ApiResponse, Category } from "@/types/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: fetchBaseQuery({
       baseUrl: `${import.meta.env.VITE_RESTAURANT_API_BASE_URL}`,
    }),

    tagTypes: ["Categories"],

    endpoints: (builder) => ({
        getCategoriesForMenu: builder.query<ApiResponse<Category[]>, string>({
            query: (menuId) => ({
                url: `categories/menus/${menuId}/categories`,
                method: "GET",
            }),
            providesTags: ["Categories"],
        }),

        getCategoryById: builder.query<ApiResponse<Category>, string>({
            query: (categoryId) => ({
                url: `categories/${categoryId}`,
                method: "GET",
            }),
            providesTags: ["Categories"],
        }),
    }),
});

export const {
    useGetCategoriesForMenuQuery,
    useGetCategoryByIdQuery,
} = categoryApi;