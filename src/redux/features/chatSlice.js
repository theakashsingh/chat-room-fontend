import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatServices from "../services/chatService";

export const getChat = createAsyncThunk(
  "chat",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await chatServices.getChat(credentials);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

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

export const createGroupChat = createAsyncThunk("createGroupChat",
async(credentials,{rejectWithValue})=>{
   try {
     const {data} = await chatServices.createGroup(credentials)
     return data
   } catch (error) {
     console.log(error)
     return rejectWithValue(error.response.data)
   }
})

const initialState = {
  selectedChat: {
    loading: false,
    value: null,
    error: null,
  },
  chats: {
    loading: false,
    value: [],
    error: null,
  },
  groupChat:{
    loading:false,
    value:null,
    error:null
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  extraReducers: builder => {
    builder.addCase(getChat.pending, state => {
      state.chats.loading = true;
    }),
      builder.addCase(getChat.fulfilled, (state, action) => {
        state.chats.value = action.payload;
        state.chats.loading = false;
      }),
      builder.addCase(getChat.rejected, (state, action) => {
        (state.chats.loading = false), (state.chats.error = action.payload);
      }),
      builder.addCase(getSelectedChat.pending, state => {
        state.selectedChat.loading = true;
      }),
      builder.addCase(getSelectedChat.fulfilled, (state, action) => {
        (state.selectedChat.loading = false),
          (state.selectedChat.value = action.payload);
        if (!state.chats.value.find(curr => curr._id === action.payload._id)) {
          state.chats.value = [action.payload, ...state.chats.value];
        }
      }),
      builder.addCase(getSelectedChat.rejected, (state, action) => {
        (state.selectedChat.loading = false),
          (state.selectedChat.error = action.payload);
      });
      builder.addCase(createGroupChat.pending,(state)=>{
          state.groupChat.loading = true
      }),
      builder.addCase(createGroupChat.fulfilled,(state,action)=>{
          state.chats.value = [action.payload, ...state.chats.value],
          state.groupChat.value = action.payload,
          state.groupChat.loading = false
      })
      builder.addCase(createGroupChat.rejected, (state,action)=>{
         state.groupChat.loading = false,
         state.error = action.payload
      })
  },
  reducers: {
    selectToChat: (state, action) => {
      state.selectedChat.value = action.payload;
    },
    resetSelectedChat:(state)=>{
        state.selectedChat.value = null
    }
  },
});

export const { selectToChat, resetSelectedChat } =
  chatSlice.actions;
export default chatSlice.reducer;
