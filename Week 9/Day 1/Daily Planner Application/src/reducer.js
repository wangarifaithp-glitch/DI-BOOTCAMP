import { ADD_TASK, DELETE_TASK, EDIT_TASK } from './actions';

const initialState = { tasksByDay: {} };

export default function plannerReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TASK: {
      const { dayId, task } = action.payload;
      return {
        ...state,
        tasksByDay: {
          ...state.tasksByDay,
          [dayId]: [...(state.tasksByDay[dayId] ?? []), task],
        },
      };
    }
    case EDIT_TASK: {
      const { dayId, taskId, text } = action.payload;
      const dayTasks = state.tasksByDay[dayId];
      if (!dayTasks?.some((task) => task.id === taskId)) return state;
      return {
        ...state,
        tasksByDay: {
          ...state.tasksByDay,
          [dayId]: dayTasks.map((task) =>
            task.id === taskId ? { ...task, text } : task,
          ),
        },
      };
    }
    case DELETE_TASK: {
      const { dayId, taskId } = action.payload;
      const dayTasks = state.tasksByDay[dayId];
      if (!dayTasks?.some((task) => task.id === taskId)) return state;
      return {
        ...state,
        tasksByDay: {
          ...state.tasksByDay,
          [dayId]: dayTasks.filter((task) => task.id !== taskId),
        },
      };
    }
    default:
      return state;
  }
}
