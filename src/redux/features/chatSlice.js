import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getChat = createAsyncThunk("chat", async () => {
  try {
    const response = await axios.get("/api/chat");
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

const initialState = {
  chat: [],
  loading: true,
  error: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  extraReducers: builder => {
    builder.addCase(getChat.pending, state => {
      state.loading = true;
    }),
      builder.addCase(getChat.fulfilled, (state, action) => {
        state.chat = action.payload;
        state.loading = false;
      }),
      builder.addCase(getChat.rejected, state => {
        (state.loading = false), (state.error = true);
      });
  },
});

export default chatSlice.reducer;
