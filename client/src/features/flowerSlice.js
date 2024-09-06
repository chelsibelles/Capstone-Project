import { createSlice } from '@reduxjs/toolkit';

// Initial state for the flowers
const initialState = {
  flowers: [], // Or any initial data
  status: 'idle', // Or 'loading', 'succeeded', 'failed'
  error: null,
};

// Create a slice of the Redux store
const flowerSlice = createSlice({
  name: 'flowers',
  initialState,
  reducers: {
    setFlowers(state, action) {
      state.flowers = action.payload;
    },
    addFlower(state, action) {
      state.flowers.push(action.payload);
    },
    removeFlower(state, action) {
      state.flowers = state.flowers.filter(flower => flower.id !== action.payload);
    },
    editFlower(state, action) {
      const { id, updatedData } = action.payload;
      const flowerIndex = state.flowers.findIndex(flower => flower.id === id);
      if (flowerIndex >= 0) {
        state.flowers[flowerIndex] = { ...state.flowers[flowerIndex], ...updatedData };
      }
    },
  },
});

// Export actions to use in components
export const { setFlowers, addFlower, removeFlower, editFlower } = flowerSlice.actions;

// Export the reducer to be used in the store
export default flowerSlice.reducer;
