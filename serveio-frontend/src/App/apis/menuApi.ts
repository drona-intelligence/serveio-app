import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse, Menu } from "@/types/types";

export const menuApi = createApi({
    reducerPath: "menuApi",

    baseQuery: fetchBaseQuery({
             baseUrl: `${import.meta.env.VITE_RESTAURANT_API_BASE_URL}`,
    }),

    tagTypes: ["Menus"],

    endpoints: (builder) => ({
        getAllMenus: builder.query<ApiResponse<Menu[]>, void>({
            query: () => ({
                url: "menus",
                method: "GET",
            }),
            providesTags: ["Menus"],
        }),

        getMenuById: builder.query<ApiResponse<Menu>, string>({
            query: (menuId) => ({
                url: `menus/${menuId}`,
                method: "GET",
            }),
            providesTags: ["Menus"],
        }),
    }),
});

export const {
    useGetAllMenusQuery,
    useGetMenuByIdQuery,
} = menuApi;