import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse, Menu, Category, MenuItem } from "@/types/types";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_RESTAURANT_API_BASE_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth?.accessToken;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Menus", "Categories", "MenuItems"],
    endpoints: (builder) => ({
        // Menu endpoints
        getAllMenus: builder.query<ApiResponse<Menu[]>, void>({
            query: () => ({ url: "menus", method: "GET" }),
            providesTags: ["Menus"],
        }),
        createMenu: builder.mutation<ApiResponse<Menu>, Partial<Menu>>({
            query: (data) => ({ url: "menus/addmenu", method: "POST", body: data }),
            invalidatesTags: ["Menus"],
        }),
        updateMenu: builder.mutation<ApiResponse<Menu>, { id: string; data: Partial<Menu> }>({
            query: ({ id, data }) => ({ url: `menus/updatemenu/${id}`, method: "PATCH", body: data }),
            invalidatesTags: ["Menus"],
        }),
        deleteMenu: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({ url: `menus/deletemenu/${id}`, method: "DELETE" }),
            invalidatesTags: ["Menus"],
        }),

        // Category endpoints
        getCategoriesForMenu: builder.query<ApiResponse<Category[]>, string>({
            query: (menuId) => ({ url: `categories/menus/${menuId}/categories`, method: "GET" }),
            providesTags: ["Categories"],
        }),
        createCategory: builder.mutation<ApiResponse<Category>, { menuId: string; data: Partial<Category> }>({
            query: ({ menuId, data }) => ({ url: `categories/menus/${menuId}/categories`, method: "POST", body: data }),
            invalidatesTags: ["Categories"],
        }),
        updateCategory: builder.mutation<ApiResponse<Category>, { id: string; data: Partial<Category> }>({
            query: ({ id, data }) => ({ url: `categories/${id}`, method: "PUT", body: data }),
            invalidatesTags: ["Categories"],
        }),
        deleteCategory: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({ url: `categories/${id}`, method: "DELETE" }),
            invalidatesTags: ["Categories"],
        }),

        // MenuItem endpoints
        getMenuItemsForCategory: builder.query<ApiResponse<MenuItem[]>, string>({
            query: (categoryId) => ({ url: `items/categories/${categoryId}/items`, method: "GET" }),
            providesTags: ["MenuItems"],
        }),
        createMenuItem: builder.mutation<ApiResponse<MenuItem>, { categoryId: string; data: Partial<MenuItem> }>({
            query: ({ categoryId, data }) => ({ url: `items/categories/${categoryId}/items`, method: "POST", body: data }),
            invalidatesTags: ["MenuItems"],
        }),
        updateMenuItem: builder.mutation<ApiResponse<MenuItem>, { id: string; data: Partial<MenuItem> }>({
            query: ({ id, data }) => ({ url: `items/${id}`, method: "PUT", body: data }),
            invalidatesTags: ["MenuItems"],
        }),
        deleteMenuItem: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({ url: `items/${id}`, method: "DELETE" }),
            invalidatesTags: ["MenuItems"],
        }),
    }),
});

export const {
    useGetAllMenusQuery,
    useCreateMenuMutation,
    useUpdateMenuMutation,
    useDeleteMenuMutation,
    useGetCategoriesForMenuQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetMenuItemsForCategoryQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
} = adminApi;
