import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addTodo,
  removeTodo,
  selectFilteredTodosCount,
  selectTodos,
  selectVisibilityFilter,
  setVisibilityFilter,
  visibilityFilters,
  toggleTodo,
} from "./todos.js";

export default function TodoList() {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  const visibilityFilter = useSelector(selectVisibilityFilter);
  const filteredTodosCount = useSelector(selectFilteredTodosCount);
  const [newTodo, setNewTodo] = useState("");

  const handleToggle = useCallback(
    (id) => dispatch(toggleTodo(id)),
    [dispatch],
  );
  const handleRemove = useCallback(
    (id) => dispatch(removeTodo(id)),
    [dispatch],
  );
  const handleFilterChange = useCallback(
    (filter) => dispatch(setVisibilityFilter(filter)),
    [dispatch],
  );
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const text = newTodo.trim();

      if (!text) return;

      dispatch(addTodo(text));
      setNewTodo("");
    },
    [dispatch, newTodo],
  );

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">One thing at a time</p>
        <h1>Today, made lighter.</h1>
        <p className="intro">A little list to help you focus on what matters.</p>
      </header>

      <section className="todo-panel" aria-labelledby="todo-title">
        <div className="panel-heading">
          <div>
            <h2 id="todo-title">Your tasks</h2>
            <p aria-live="polite">
              {filteredTodosCount}{" "}
              {filteredTodosCount === 1 ? "task" : "tasks"}
              {visibilityFilter !== "All"
                ? ` ${visibilityFilter.toLowerCase()}`
                : ""}
            </p>
          </div>
          <div className="filters" aria-label="Filter todos">
            {visibilityFilters.map((filter) => (
              <button
                key={filter}
                className="filter-button"
                type="button"
                aria-pressed={visibilityFilter === filter}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <form className="add-form" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="new-todo">
            Add a task
          </label>
          <input
            id="new-todo"
            type="text"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="What needs to get done?"
            maxLength={120}
          />
          <button type="submit" disabled={!newTodo.trim()}>
            Add task
          </button>
        </form>

        {todos.length > 0 ? (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li className="todo-item" key={todo.id}>
                <label className="todo-label">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                  />
                  <span className="checkbox-mark" aria-hidden="true" />
                  <span className={todo.completed ? "todo-text completed" : "todo-text"}>
                    {todo.text}
                  </span>
                </label>
                <button
                  className="delete-button"
                  type="button"
                  aria-label={`Delete ${todo.text}`}
                  onClick={() => handleRemove(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">
            {visibilityFilter === "Completed"
              ? "No completed tasks yet. Keep going!"
              : visibilityFilter === "Active"
                ? "You’re all caught up. Enjoy the breathing room."
                : "Your list is clear. Add a task whenever you’re ready."}
          </p>
        )}

        <footer className="panel-footer">
          <span>{visibilityFilter} tasks</span>
          <span>{filteredTodosCount} shown</span>
        </footer>
      </section>
    </main>
  );
}
