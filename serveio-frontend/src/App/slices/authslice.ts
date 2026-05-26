import type { AuthState, User } from "@/types/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { 
    loadAuthFromLocalStorage, 
    saveAuthToLocalStorage, 
    clearAuthFromLocalStorage 
} from "@/utils/localStorage";

// Load initial state from localStorage
const persistedAuth = loadAuthFromLocalStorage();

const initialState: AuthState = persistedAuth || {
    user: null,
    accessToken: null,
    isAuthenticated: false,
};

export const authSlice = createSlice({
    name: 'authslice',
    initialState,
    reducers: {
        setcredentials: (state, action: PayloadAction<{ user: User, accesstoken: string }>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accesstoken;
            state.isAuthenticated = true;
            
            // Save to localStorage
            saveAuthToLocalStorage({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            });
        },
        clearCredentials: (state) => {
            state.accessToken = null;
            state.user = null;
            state.isAuthenticated = false;
            
            // Clear from localStorage
            clearAuthFromLocalStorage();
        },
    }
})

export const {
    setcredentials,
    clearCredentials
} = authSlice.actions;

export default authSlice.reducer;