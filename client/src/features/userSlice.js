import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for the user
const initialState = {
  user: null,
  status: 'idle', // Can be 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

// Thunks for handling async operations
export const registerUser = createAsyncThunk('user/register', async (userData) => {
  const response = await axios.post('/api/register', userData);
  return response.data;
});

export const loginUserThunk = createAsyncThunk('user/login', async (credentials) => {
  const response = await axios.post('/api/login', credentials);
  return response.data;
});

export const fetchUserDetails = createAsyncThunk('user/fetchDetails', async () => {
  const response = await axios.get('/api/account'); // Endpoint for fetching user details
  return response.data;
});

export const updateUserDetailsThunk = createAsyncThunk('user/updateDetails', async (userData) => {
  const response = await axios.put('/api/account', userData); // Endpoint for updating user details
  return response.data;
});

// Create a slice of the Redux store
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    updateUserDetails(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUserDetailsThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateUserDetailsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions to use in components
export const { logoutUser, updateUserDetails } = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
