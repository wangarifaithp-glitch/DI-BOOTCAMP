import { createAsyncThunk } from '@reduxjs/toolkit';

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (name) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return { name: name.trim() };
  },
);
