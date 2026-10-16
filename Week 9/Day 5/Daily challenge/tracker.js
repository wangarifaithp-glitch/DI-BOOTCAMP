import { configureStore, createSelector, createSlice } from "@reduxjs/toolkit";

export const UNCATEGORIZED_ID = "uncategorized";

const initialTasks = [
  { id: 1, title: "Plan the week's priorities", categoryId: "work", completed: true },
  { id: 2, title: "Finish the project proposal", categoryId: "work", completed: false },
  { id: 3, title: "Take a proper lunch break", categoryId: "personal", completed: false },
  { id: 4, title: "Read for twenty minutes", categoryId: "learning", completed: false },
];

const initialCategories = [
  { id: UNCATEGORIZED_ID, name: "Uncategorized", protected: true },
  { id: "work", name: "Work" },
  { id: "personal", name: "Personal" },
  { id: "learning", name: "Learning" },
];

const tasksSlice = createSlice({
  name: "tasks",
  initialState: initialTasks,
  reducers: {
    addTask: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare({ title, categoryId }) {
        return {
          payload: {
            id: `task-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            title,
            categoryId,
            completed: false,
          },
        };
      },
    },
    editTask(state, action) {
      const task = state.find((item) => item.id === action.payload.id);
      if (!task) {
        throw new Error(`Cannot edit missing task with ID ${action.payload.id}`);
      }
      task.title = action.payload.title;
      task.categoryId = action.payload.categoryId;
    },
    deleteTask(state, action) {
      const taskIndex = state.findIndex((item) => item.id === action.payload);
      if (taskIndex === -1) {
        throw new Error(`Cannot delete missing task with ID ${action.payload}`);
      }
      state.splice(taskIndex, 1);
    },
    updateTaskProgress(state, action) {
      const task = state.find((item) => item.id === action.payload.id);
      if (!task) {
        throw new Error(`Cannot update missing task with ID ${action.payload.id}`);
      }
      task.completed = action.payload.completed ?? !task.completed;
    },
    moveTasksToCategory(state, action) {
      for (const task of state) {
        if (task.categoryId === action.payload.fromCategoryId) {
          task.categoryId = action.payload.toCategoryId;
        }
      }
    },
  },
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialCategories,
  reducers: {
    addCategory: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(name) {
        return {
          payload: {
            id: `category-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name,
          },
        };
      },
    },
    editCategory(state, action) {
      const category = state.find((item) => item.id === action.payload.id);
      if (!category) {
        throw new Error(`Cannot edit missing category with ID ${action.payload.id}`);
      }
      if (category.protected) {
        throw new Error("The Uncategorized category cannot be renamed.");
      }
      category.name = action.payload.name;
    },
    deleteCategory(state, action) {
      const categoryIndex = state.findIndex((item) => item.id === action.payload);
      if (categoryIndex === -1) {
        throw new Error(`Cannot delete missing category with ID ${action.payload}`);
      }
      if (state[categoryIndex].protected) {
        throw new Error("The Uncategorized category cannot be deleted.");
      }
      state.splice(categoryIndex, 1);
    },
  },
});

export const {
  addTask,
  editTask,
  deleteTask,
  updateTaskProgress,
  moveTasksToCategory,
} = tasksSlice.actions;
export const { addCategory, editCategory, deleteCategory } =
  categoriesSlice.actions;

export const tasksReducer = tasksSlice.reducer;
export const categoriesReducer = categoriesSlice.reducer;

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    categories: categoriesReducer,
  },
});

const selectAllTasks = (state) => state.tasks;
const selectAllCategories = (state) => state.categories;

export const selectTasksByCategory = createSelector(
  [selectAllTasks, (_state, categoryId) => categoryId],
  (tasks, categoryId) =>
    categoryId === "all"
      ? tasks
      : tasks.filter((task) => task.categoryId === categoryId),
);

export const selectCompletedTasks = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter((task) => task.completed).length,
);

export const selectCategoryById = createSelector(
  [selectAllCategories, (_state, categoryId) => categoryId],
  (categories, categoryId) =>
    categories.find((category) => category.id === categoryId),
);

export const selectCategories = (state) => state.categories;
export const selectTotalTasks = (state) => state.tasks.length;
