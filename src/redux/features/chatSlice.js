import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import chatServices from "../services/chatService";

export const getChat = createAsyncThunk("chat", async () => {
  try {
    const response = await axios.get("/api/chat");
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const getSelectedChat = createAsyncThunk(
  "selectedChat",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await chatServices.selectChat(credentials);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  selectedChat: {
    loading: false,
    value: null,
    error: null,
  },
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
      }),
      builder.addCase(getSelectedChat.pending, state => {
        state.selectedChat.loading = true;
      }),
      builder.addCase(getSelectedChat.fulfilled, (state, action) => {
        (state.selectedChat.loading = false), (state.selectedChat.value = action.payload);
      }),
      builder.addCase(getSelectedChat.rejected, (state, action) => {
        (state.selectedChat.loading = false), (state.selectedChat.error = action.payload);
      });
  },
});

export default chatSlice.reducer;
