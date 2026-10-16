import assert from "node:assert/strict";
import test from "node:test";
import { configureStore } from "@reduxjs/toolkit";

import {
  addTodo,
  removeTodo,
  selectFilteredTodosCount,
  selectTodos,
  selectVisibilityFilter,
  setVisibilityFilter,
  todosReducer,
  toggleTodo,
} from "./todos.js";

const createTestStore = () =>
  configureStore({ reducer: { todos: todosReducer } });

test("the store starts with todos and shows them all by default", () => {
  const store = createTestStore();

  assert.equal(selectVisibilityFilter(store.getState()), "All");
  assert.equal(selectTodos(store.getState()).length, 3);
  assert.equal(selectFilteredTodosCount(store.getState()), 3);
});

test("the visibility filter selects active and completed todos", () => {
  const store = createTestStore();

  store.dispatch(setVisibilityFilter("Active"));
  assert.ok(selectTodos(store.getState()).every((todo) => !todo.completed));
  assert.equal(selectFilteredTodosCount(store.getState()), 2);

  store.dispatch(setVisibilityFilter("Completed"));
  assert.ok(selectTodos(store.getState()).every((todo) => todo.completed));
  assert.equal(selectFilteredTodosCount(store.getState()), 1);
});

test("todos can be added, toggled, and removed", () => {
  const store = createTestStore();

  store.dispatch(addTodo("Water the plants"));
  const addedTodo = store.getState().todos.items.at(-1);
  assert.equal(addedTodo.text, "Water the plants");
  assert.equal(addedTodo.completed, false);

  store.dispatch(toggleTodo(addedTodo.id));
  assert.equal(
    store.getState().todos.items.find((todo) => todo.id === addedTodo.id)
      .completed,
    true,
  );

  store.dispatch(removeTodo(addedTodo.id));
  assert.equal(
    store.getState().todos.items.some((todo) => todo.id === addedTodo.id),
    false,
  );
});
