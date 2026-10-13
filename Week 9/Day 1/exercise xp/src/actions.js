export const ADD_TODO = 'todos/add';
export const TOGGLE_TODO = 'todos/toggle';
export const REMOVE_TODO = 'todos/remove';

export const addTodo = (text) => ({
  type: ADD_TODO,
  payload: {
    id: crypto.randomUUID(),
    text,
  },
});

export const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: id,
});

export const removeTodo = (id) => ({
  type: REMOVE_TODO,
  payload: id,
});
