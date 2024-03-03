import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./features/chatSlice"
import authReduces from "./features/authSlice"
import messageSlice from "./features/messageSlice";
export const store = configureStore({
    reducer:{
        chat:chatReducer,
        auth:authReduces,
        message:messageSlice
    },
    
});
