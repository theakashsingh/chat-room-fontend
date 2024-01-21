import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../services/authService";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user signup
export const signupUser = createAsyncThunk(
  "auth",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData);
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  login: false,
  signup: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: builder => {
    builder.addCase(signupUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      (state.loading = false),
        (state.user = action.payload),
        (state.signup = true);
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload);
    });

    builder.addCase(loginUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      (state.loading = false),
        (state.user = action.payload),
        (state.login = true);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      (state.loading = false), (state.error = action.payload);
    });
  },
});

export default authSlice.reducer;
