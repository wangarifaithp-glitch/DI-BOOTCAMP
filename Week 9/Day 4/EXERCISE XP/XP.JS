import { configureStore, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const USER_API_URL = 'https://jsonplaceholder.typicode.com/users/1';

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    const response = await fetch(USER_API_URL);

    if (!response.ok) {
      return rejectWithValue(`Request failed with status ${response.status}.`);
    }

    return response.json();
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Unable to fetch user data.';
      });
  },
});

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;