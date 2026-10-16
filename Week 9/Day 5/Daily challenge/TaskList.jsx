import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addTask,
  deleteTask,
  editTask,
  selectCategories,
  selectCategoryById,
  selectCompletedTasks,
  selectTasksByCategory,
  selectTotalTasks,
  updateTaskProgress,
  UNCATEGORIZED_ID,
} from "./tracker.js";

export default function TaskList({ selectedCategory }) {
  const dispatch = useDispatch();
  const tasks = useSelector((state) =>
    selectTasksByCategory(state, selectedCategory),
  );
  const categories = useSelector(selectCategories);
  const completedCount = useSelector(selectCompletedTasks);
  const totalCount = useSelector(selectTotalTasks);
  const [newTitle, setNewTitle] = useState("");
  const [newCategoryId, setNewCategoryId] = useState(UNCATEGORIZED_ID);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState("");

  const handleAdd = useCallback(
    (event) => {
      event.preventDefault();
      const title = newTitle.trim();
      if (!title) return;
      dispatch(addTask({ title, categoryId: newCategoryId }));
      setNewTitle("");
    },
    [dispatch, newCategoryId, newTitle],
  );

  const handleToggle = useCallback(
    (id, completed) => dispatch(updateTaskProgress({ id, completed })),
    [dispatch],
  );

  const handleDelete = useCallback(
    (id) => dispatch(deleteTask(id)),
    [dispatch],
  );

  const beginEditing = useCallback((task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingCategoryId(task.categoryId);
  }, []);

  const handleEdit = useCallback(
    (event) => {
      event.preventDefault();
      const title = editingTitle.trim();
      if (!title || !editingId) return;
      dispatch(
        editTask({
          id: editingId,
          title,
          categoryId: editingCategoryId,
        }),
      );
      setEditingId(null);
    },
    [dispatch, editingCategoryId, editingId, editingTitle],
  );

  const selectedCategoryDetails = useSelector((state) =>
    selectedCategory === "all"
      ? undefined
      : selectCategoryById(state, selectedCategory),
  );

  return (
    <section className="task-panel" aria-labelledby="task-list-title">
      <div className="task-heading">
        <div>
          <p className="eyebrow">Your day, at a glance</p>
          <h2 id="task-list-title">
            {selectedCategoryDetails?.name ?? "All tasks"}
          </h2>
        </div>
        <p className="progress-count" aria-live="polite">
          <strong>{completedCount}</strong> of {totalCount} completed
        </p>
      </div>

      <form className="task-add-form" onSubmit={handleAdd}>
        <label className="visually-hidden" htmlFor="new-task">
          Add a task
        </label>
        <input
          id="new-task"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          placeholder="What would you like to get done?"
          maxLength={120}
        />
        <label className="visually-hidden" htmlFor="new-task-category">
          Task category
        </label>
        <select
          id="new-task-category"
          value={newCategoryId}
          onChange={(event) => setNewCategoryId(event.target.value)}
        >
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!newTitle.trim()}>
          Add task
        </button>
      </form>

      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task) => {
            const categoryName =
              categories.find((category) => category.id === task.categoryId)
                ?.name ?? "Uncategorized";

            return (
              <li className="task-item" key={task.id}>
                {editingId === task.id ? (
                  <form className="task-edit-form" onSubmit={handleEdit}>
                    <label
                      className="visually-hidden"
                      htmlFor={`edit-task-${task.id}`}
                    >
                      Edit task
                    </label>
                    <input
                      id={`edit-task-${task.id}`}
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                      maxLength={120}
                      autoFocus
                    />
                    <label
                      className="visually-hidden"
                      htmlFor={`edit-category-${task.id}`}
                    >
                      Edit task category
                    </label>
                    <select
                      id={`edit-category-${task.id}`}
                      value={editingCategoryId}
                      onChange={(event) =>
                        setEditingCategoryId(event.target.value)
                      }
                    >
                      {categories.map((category) => (
                        <option value={category.id} key={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="small-button"
                      type="submit"
                      disabled={!editingTitle.trim()}
                    >
                      Save
                    </button>
                    <button
                      className="small-button secondary"
                      type="button"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <label className="task-check">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(event) =>
                          handleToggle(task.id, event.target.checked)
                        }
                      />
                      <span className="checkmark" aria-hidden="true" />
                      <span
                        className={
                          task.completed ? "task-title completed" : "task-title"
                        }
                      >
                        {task.title}
                      </span>
                    </label>
                    <div className="task-meta">
                      <span className="task-category">{categoryName}</span>
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => beginEditing(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-button delete-button"
                        type="button"
                        aria-label={`Delete ${task.title}`}
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="empty-state">
          No tasks here yet. Add a task to start tracking your progress.
        </p>
      )}
    </section>
  );
}
