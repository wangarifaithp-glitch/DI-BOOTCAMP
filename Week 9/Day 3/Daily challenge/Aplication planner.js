import { configureStore, createSlice, nanoid } from '@reduxjs/toolkit';

const plannerSlice = createSlice({
  name: 'planner',
  initialState: {
    tasksByDay: {},
  },
  reducers: {
    addTask: {
      reducer(state, action) {
        const { dayId, task } = action.payload;
        (state.tasksByDay[dayId] ??= []).push(task);
      },
      prepare({ dayId, text }) {
        return {
          payload: {
            dayId,
            task: {
              id: nanoid(),
              text,
            },
          },
        };
      },
    },
    editTask(state, action) {
      const { dayId, taskId, text } = action.payload;
      const task = state.tasksByDay[dayId]?.find((item) => item.id === taskId);
      if (task) {
        task.text = text;
      }
    },
    deleteTask(state, action) {
      const { dayId, taskId } = action.payload;
      const tasks = state.tasksByDay[dayId];
      if (!tasks) return;

      const taskIndex = tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
      }
      if (tasks.length === 0) {
        delete state.tasksByDay[dayId];
      }
    },
  },
});

export const { addTask, editTask, deleteTask } = plannerSlice.actions;

const store = configureStore({
  reducer: plannerSlice.reducer,
});

export default store;