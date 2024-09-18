import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for the flowers
const initialState = {
  flowers: [],
  status: 'idle',
  error: null,
};

// Thunks for handling async operations
export const fetchFlowers = createAsyncThunk('flowers/fetchFlowers', async () => {
  const response = await axios.get('/api/flowers');
  return response.data.flowers;
});

export const addFlower = createAsyncThunk('flowers/addFlower', async (flowerData) => {
  const response = await axios.post('/api/flowers', flowerData);
  return response.data.flower;
});

export const updateFlower = createAsyncThunk('flowers/updateFlower', async ({ id, updatedData }) => {
  const response = await axios.put(`/api/flowers/${id}`, updatedData);
  return response.data.flower;
});

export const deleteFlower = createAsyncThunk('flowers/deleteFlower', async (id) => {
  await axios.delete(`/api/flowers/${id}`);
  return id;
});

// Create a slice of the Redux store
const flowerSlice = createSlice({
  name: 'flowers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlowers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFlowers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.flowers = action.payload;
      })
      .addCase(fetchFlowers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addFlower.fulfilled, (state, action) => {
        state.flowers.push(action.payload);
      })
      .addCase(updateFlower.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        const flowerIndex = state.flowers.findIndex(flower => flower.id === id);
        if (flowerIndex >= 0) {
          state.flowers[flowerIndex] = { ...state.flowers[flowerIndex], ...updatedData };
        }
      })
      .addCase(deleteFlower.fulfilled, (state, action) => {
        state.flowers = state.flowers.filter(flower => flower.id !== action.payload);
      });
  },
});

// Export the reducer to be used in the store
export default flowerSlice.reducer;
