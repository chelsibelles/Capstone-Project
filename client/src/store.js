import { configureStore } from '@reduxjs/toolkit';
import flowerReducer from './features/flowerSlice';
import userReducer from './features/userSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    flowers: flowerReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', 
});

export default store;
