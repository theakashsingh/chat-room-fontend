import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import messageServices from "../services/messageService";
import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
export const sendMessageInChat = createAsyncThunk(
  "message/sendMessage",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await messageServices.sendMessage(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getMessageInChat = createAsyncThunk(
  "message/getMessage",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await messageServices.getMessages(credentials);
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  newChatMessage: {
    loading: false,
    value: null,
    error: null,
  },
  messages: {
    loading: false,
    value: [],
    error: null,
  },
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  extraReducers: builder => {
    builder.addCase(sendMessageInChat.pending, state => {
      state.newChatMessage.loading = true;
    }),
      builder.addCase(sendMessageInChat.fulfilled, (state, action) => {
        let socket = io(ENDPOINT);
        socket.emit("new message", action.payload),
        (state.newChatMessage.loading = false),
          (state.newChatMessage.value = action.payload),
          (state.messages.value = [...state.messages.value, action.payload]);
      });
    builder.addCase(sendMessageInChat.rejected, (state, action) => {
      (state.newChatMessage.loading = false),
        (state.newChatMessage.error = action.payload);
    });

    // get all messages
    builder.addCase(getMessageInChat.pending, state => {
      state.messages.loading = true;
    }), 
      builder.addCase(getMessageInChat.fulfilled, (state, action) => {
        let socket = io(ENDPOINT)
        socket.emit("join chat", state.selectedChat?.value?._id);
        (state.messages.loading = false),
          (state.messages.value = action.payload)
      });
    builder.addCase(getMessageInChat.rejected, (state, action) => {
      (state.messages.loading = false),
        (state.messages.error = action.payload);
    });
  },
  reducers:{
    getNewMessageReceived:(state,action)=>{
        state.messages.value = [...state.messages.value,action.payload]
    }
  }
});

export const {getNewMessageReceived} = messageSlice.actions
export default messageSlice.reducer;
