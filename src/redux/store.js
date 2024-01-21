import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./features/chatSlice"
import authReduces from "./features/authSlice"
export const store = configureStore({
    reducer:{
        chat:chatReducer,
        auth:authReduces
    },
    
});
