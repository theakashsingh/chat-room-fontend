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

export const createGroupChat = createAsyncThunk(
  "createGroupChat",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await chatServices.createGroup(credentials);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const renameGroupChat = createAsyncThunk(
  "renameGroupChat",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await chatServices.renameGroup(credentials);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const addUserToGroup = createAsyncThunk(
  "addUserToGroup",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await chatServices.addToGroup(credentials);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const removeUserFromGroup = createAsyncThunk(
  "removeUserFromGroup",
  async (credentials, { rejectWithValue }) => {
    const { userToRemove } = credentials;
    try {
      const { data } = await chatServices.removeFromGroup(credentials);
      return { data, userToRemove };
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
  chats: {
    loading: false,
    value: [],
    error: null,
  },
  groupChat: {
    loading: false,
    value: null,
    error: null,
  },
  renameGroup: {
    loading: false,
    value: null,
    error: false,
  },
  addToGroup: {
    loading: false,
    value: null,
    error: false,
  },
  removeFromGroup: {
    loading: false,
    value: null,
    error: false,
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  extraReducers: builder => {
    // Get all chat
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
      // Select Group chat
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

    // Create group chat
    builder.addCase(createGroupChat.pending, state => {
      state.groupChat.loading = true;
    }),
      builder.addCase(createGroupChat.fulfilled, (state, action) => {
        (state.chats.value = [action.payload, ...state.chats.value]),
          (state.groupChat.value = action.payload),
          (state.groupChat.loading = false);
      });
    builder.addCase(createGroupChat.rejected, (state, action) => {
      (state.groupChat.loading = false), (state.error = action.payload);
    }),
      // Rename Group Chat
      builder.addCase(renameGroupChat.pending),
      state => {
        state.renameGroup.loading = true;
      },
      builder.addCase(renameGroupChat.fulfilled, (state, action) => {
        (state.renameGroup.loading = false),
          (state.renameGroup.value = action.payload),
          (state.selectedChat.value = action.payload);
      }),
      builder.addCase(renameGroupChat.rejected, (state, action) => {
        (state.renameGroup.loading = false),
          (state.renameGroup.error = action.payload);
      }),
      // Add user to group chat
      builder.addCase(addUserToGroup.pending, state => {
        state.addToGroup.loading = true;
      }),
      builder.addCase(addUserToGroup.fulfilled, (state, action) => {
        state.addToGroup.loading = false;
        (state.addToGroup.value = action.payload),
          (state.selectedChat.value = action.value);
      }),
      builder.addCase(addUserToGroup.rejected, (state, action) => {
        (state.addToGroup.loading = false),
          (state.addToGroup.error = action.error);
      });

    // Remove user from group
    builder.addCase(removeUserFromGroup.pending, state => {
      state.removeFromGroup.loading = true;
    }),
      builder.addCase(removeUserFromGroup.fulfilled, (state, action) => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (action.payload.userToRemove._id === user._id) {
          state.selectedChat.value = null;
        } else {
          state.selectedChat.value = action.payload.data;
        }
        state.removeFromGroup.loading = false;
        state.removeFromGroup.value = action.payload.data;
      }),
      builder.addCase(removeUserFromGroup.rejected, (state, action) => {
        (state.addToGroup.loading = false),
          (state.addToGroup.error = action.error);
      });
  },
  reducers: {
    selectToChat: (state, action) => {
      state.selectedChat.value = action.payload;
    },
    resetSelectedChat: state => {
      state.selectedChat.value = null;
    },
  },
});

export const { selectToChat, resetSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
