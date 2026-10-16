import { configureStore, createSelector, createSlice } from "@reduxjs/toolkit";

export const visibilityFilters = ["All", "Active", "Completed"];

const initialState = {
  items: [
    { id: 1, text: "Plan the week", completed: true },
    { id: 2, text: "Read a chapter", completed: false },
    { id: 3, text: "Take a short walk", completed: false },
  ],
  visibilityFilter: "All",
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo(state, action) {
      const id =
        state.items.reduce((largestId, todo) => Math.max(largestId, todo.id), 0) +
        1;
      state.items.push({ id, text: action.payload, completed: false });
    },
    toggleTodo(state, action) {
      const todo = state.items.find((item) => item.id === action.payload);

      if (!todo) {
        throw new Error(`Cannot toggle missing todo with ID ${action.payload}`);
      }

      todo.completed = !todo.completed;
    },
    removeTodo(state, action) {
      const todoIndex = state.items.findIndex(
        (item) => item.id === action.payload,
      );

      if (todoIndex === -1) {
        throw new Error(`Cannot remove missing todo with ID ${action.payload}`);
      }

      state.items.splice(todoIndex, 1);
    },
    setVisibilityFilter(state, action) {
      if (!visibilityFilters.includes(action.payload)) {
        throw new Error(`Unknown todo visibility filter: ${action.payload}`);
      }

      state.visibilityFilter = action.payload;
    },
  },
});

export const {
  addTodo,
  toggleTodo,
  removeTodo,
  setVisibilityFilter,
} = todosSlice.actions;

export const todosReducer = todosSlice.reducer;

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

const selectAllTodos = (state) => state.todos.items;
export const selectVisibilityFilter = (state) => state.todos.visibilityFilter;

export const selectTodos = createSelector(
  [selectAllTodos, selectVisibilityFilter],
  (todos, visibilityFilter) =>
    todos.filter(
      (todo) =>
        visibilityFilter === "All" ||
        (visibilityFilter === "Active" && !todo.completed) ||
        (visibilityFilter === "Completed" && todo.completed),
    ),
);

export const selectFilteredTodosCount = createSelector(
  [selectTodos],
  (todos) => todos.length,
);
