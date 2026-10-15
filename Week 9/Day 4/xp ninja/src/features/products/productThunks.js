import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    const response = await fetch('https://fakestoreapi.com/products?limit=8');

    if (!response.ok) {
      return rejectWithValue(`Product request failed with status ${response.status}.`);
    }

    return response.json();
  },
);
