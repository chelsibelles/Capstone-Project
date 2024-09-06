import { configureStore } from '@reduxjs/toolkit';
import flowerReducer from './features/flowerSlice';
import userReducer from './features/userSlice';

const store = configureStore({
  reducer: {
    flowers: flowerReducer,
    user: userReducer,
  },
});

export default store;
