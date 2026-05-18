import type { CartItem, MenuItem } from "@/types/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";




interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",

    initialState,

    reducers: {
        addToCart: (state, action: PayloadAction<MenuItem>) => {
            const existingItem = state.items.find(
                (item) => item.id === action.payload.id
            );

            // IF ITEM ALREADY EXISTS
            if (existingItem) {
                existingItem.quantity += 1;
            }

            // ADD NEW ITEM
            else {
                state.items.push({
                    ...action.payload,
                    quantity: 1,
                });
            }
        },

        removeFromCart: (
            state,
            action: PayloadAction<string>
        ) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload
            );
        },

        increaseQuantity: (
            state,
            action: PayloadAction<string>
        ) => {
            const item = state.items.find(
                (item) => item.id === action.payload
            );

            if (item) {
                item.quantity += 1;
            }
        },

        decreaseQuantity: (
            state,
            action: PayloadAction<string>
        ) => {
            const item = state.items.find(
                (item) => item.id === action.payload
            );

            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.items = state.items.filter(
                        (i) => i.id !== action.payload
                    );
                }
            }
        },

        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;