import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for the user
const initialState = {
  user: null,
  status: 'idle', // Can be 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

// Create a slice of the Redux store
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    logoutUser(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    registrationSuccess(state, action) {
      state.user = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    registrationFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    updateUserDetails(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    fetchUserDetailsSuccess(state, action) {
      state.user = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    fetchUserDetailsFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

// Thunks for handling async operations
export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post('/api/register', userData);
    dispatch(registrationSuccess(response.data));
  } catch (error) {
    dispatch(registrationFailure(error.message));
  }
};

export const loginUserThunk = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post('/api/login', credentials);
    dispatch(setUser(response.data));
  } catch (error) {
    dispatch(registrationFailure(error.message));
  }
};

export const fetchUserDetails = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/account'); // Endpoint for fetching user details
    dispatch(fetchUserDetailsSuccess(response.data));
  } catch (error) {
    dispatch(fetchUserDetailsFailure(error.message));
  }
};

export const updateUserDetailsThunk = (userData) => async (dispatch) => {
  try {
    const response = await axios.put('/api/account', userData); // Endpoint for updating user details
    dispatch(updateUserDetails(response.data));
  } catch (error) {
    console.error('Failed to update user details:', error);
    // Handle error if needed
  }
};

// Export actions to use in components
export const { setUser, logoutUser, registrationSuccess, registrationFailure, updateUserDetails, fetchUserDetailsSuccess, fetchUserDetailsFailure } = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;
