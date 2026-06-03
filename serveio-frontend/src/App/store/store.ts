import { configureStore } from '@reduxjs/toolkit'
import { menuApi } from '../apis/menuApi'
import { categoryApi } from '../apis/categoryApi'
import { menuItemsApi } from '../apis/menuItemsApi'
import authreducer from '../slices/authslice'
import notificationreducer from '../slices/notificationSlice'
import { authApi } from '../apis/authApi'
import { profileApi } from '../apis/profileApi'
import { adminApi } from '../apis/adminApi'
import { cartApi } from '../apis/cartApi'
import { orderApi } from '../apis/orderApi'
import { notificationApi } from '../apis/notificationApi'

export const store = configureStore({
    reducer: {
        auth: authreducer,
        notifications: notificationreducer,

        [authApi.reducerPath]: authApi.reducer,
        [menuApi.reducerPath]: menuApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [menuItemsApi.reducerPath]: menuItemsApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            menuApi.middleware,
            categoryApi.middleware,
            menuItemsApi.middleware,
            profileApi.middleware,
            authApi.middleware,
            adminApi.middleware,
            cartApi.middleware,
            orderApi.middleware,
            notificationApi.middleware,
        ),
})

// Setup listener to invalidate public API caches when admin makes changes
store.subscribe(() => {
    const state = store.getState();
    
    // Check if any admin mutations are in progress or completed
    const adminApiState = state[adminApi.reducerPath];
    
    if (adminApiState) {
        // Invalidate menuApi cache when menus are modified
        const menuMutations = Object.values(adminApiState.mutations || {}).filter(
            (mutation: any) => 
                mutation?.endpointName?.includes('Menu') && 
                mutation?.status === 'fulfilled'
        );
        
        if (menuMutations.length > 0) {
            store.dispatch(menuApi.util.invalidateTags(['Menus']));
        }
        
        // Invalidate categoryApi cache when categories are modified
        const categoryMutations = Object.values(adminApiState.mutations || {}).filter(
            (mutation: any) => 
                mutation?.endpointName?.includes('Category') && 
                mutation?.status === 'fulfilled'
        );
        
        if (categoryMutations.length > 0) {
            store.dispatch(categoryApi.util.invalidateTags(['Categories']));
        }
        
        // Invalidate menuItemsApi cache when items are modified
        const itemMutations = Object.values(adminApiState.mutations || {}).filter(
            (mutation: any) => 
                mutation?.endpointName?.includes('MenuItem') && 
                mutation?.status === 'fulfilled'
        );
        
        if (itemMutations.length > 0) {
            store.dispatch(menuItemsApi.util.invalidateTags(['MenuItems']));
        }
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch