import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=8');

    if (!response.ok) {
      return rejectWithValue(`Todo request failed with status ${response.status}.`);
    }

    const todos = await response.json();
    return todos.map(({ id, title, completed }) => ({ id, title, completed }));
  },
);
