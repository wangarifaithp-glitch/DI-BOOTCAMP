import assert from "node:assert/strict";
import test from "node:test";
import { configureStore } from "@reduxjs/toolkit";

import {
  addCategory,
  addTask,
  categoriesReducer,
  deleteCategory,
  deleteTask,
  editCategory,
  editTask,
  moveTasksToCategory,
  selectCategoryById,
  selectCompletedTasks,
  selectTasksByCategory,
  tasksReducer,
  updateTaskProgress,
  UNCATEGORIZED_ID,
} from "./tracker.js";

const createTestStore = () =>
  configureStore({
    reducer: { tasks: tasksReducer, categories: categoriesReducer },
  });

test("selectors return category tasks, completed count, and category details", () => {
  const store = createTestStore();
  const state = store.getState();

  assert.equal(selectTasksByCategory(state, "work").length, 2);
  assert.equal(selectTasksByCategory(state, "all").length, 4);
  assert.equal(selectCompletedTasks(state), 1);
  assert.equal(selectCategoryById(state, "work").name, "Work");
});

test("tasks can be added, edited, progressed, and deleted", () => {
  const store = createTestStore();
  const original = store.getState().tasks[1];

  store.dispatch(
    editTask({
      id: original.id,
      title: "Send the project proposal",
      categoryId: "learning",
    }),
  );
  assert.equal(
    store.getState().tasks.find((task) => task.id === original.id).title,
    "Send the project proposal",
  );

  store.dispatch(updateTaskProgress({ id: original.id, completed: true }));
  assert.equal(selectCompletedTasks(store.getState()), 2);

  store.dispatch(deleteTask(original.id));
  assert.equal(
    store.getState().tasks.some((task) => task.id === original.id),
    false,
  );

  store.dispatch(addTask({ title: "Review notes", categoryId: "learning" }));
  assert.equal(
    selectTasksByCategory(store.getState(), "learning").some(
      (task) => task.title === "Review notes",
    ),
    true,
  );
});

test("category changes preserve tasks by moving them to Uncategorized", () => {
  const store = createTestStore();
  const category = store.getState().categories.find((item) => item.id === "work");

  store.dispatch(addCategory("Wellbeing"));
  const newCategory = store
    .getState()
    .categories.find((item) => item.name === "Wellbeing");
  store.dispatch(editCategory({ id: newCategory.id, name: "Health" }));
  assert.equal(selectCategoryById(store.getState(), newCategory.id).name, "Health");

  store.dispatch(moveTasksToCategory({ fromCategoryId: category.id, toCategoryId: UNCATEGORIZED_ID }));
  store.dispatch(deleteCategory(category.id));

  assert.equal(selectTasksByCategory(store.getState(), category.id).length, 0);
  assert.equal(selectTasksByCategory(store.getState(), UNCATEGORIZED_ID).length, 2);
});
