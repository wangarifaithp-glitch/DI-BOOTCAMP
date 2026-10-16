import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addCategory,
  deleteCategory,
  editCategory,
  moveTasksToCategory,
  selectCategories,
  UNCATEGORIZED_ID,
} from "./tracker.js";

export default function CategorySelector({ selectedCategory, onSelect }) {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = useCallback(
    (event) => {
      event.preventDefault();
      const name = newCategory.trim();
      if (!name) return;
      dispatch(addCategory(name));
      setNewCategory("");
    },
    [dispatch, newCategory],
  );

  const handleEdit = useCallback(
    (event) => {
      event.preventDefault();
      const name = editingName.trim();
      if (!name || !editingId) return;
      dispatch(editCategory({ id: editingId, name }));
      setEditingId(null);
      setEditingName("");
    },
    [dispatch, editingId, editingName],
  );

  const handleDelete = useCallback(
    (categoryId) => {
      const category = categories.find((item) => item.id === categoryId);
      if (category?.protected) return;
      dispatch(
        moveTasksToCategory({
          fromCategoryId: categoryId,
          toCategoryId: UNCATEGORIZED_ID,
        }),
      );
      dispatch(deleteCategory(categoryId));
      if (selectedCategory === categoryId) onSelect("all");
    },
    [categories, dispatch, onSelect, selectedCategory],
  );

  return (
    <section className="category-panel" aria-labelledby="categories-title">
      <h2 id="categories-title">Categories</h2>
      <div className="category-options" role="group" aria-label="Select a category">
        <button
          className="category-option"
          type="button"
          aria-pressed={selectedCategory === "all"}
          onClick={() => onSelect("all")}
        >
          <span>All tasks</span>
        </button>
        {categories.map((category) => (
          <div className="category-row" key={category.id}>
            {editingId === category.id ? (
              <form className="category-edit-form" onSubmit={handleEdit}>
                <label className="visually-hidden" htmlFor="edit-category">
                  Rename category
                </label>
                <input
                  id="edit-category"
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  maxLength={40}
                  autoFocus
                />
                <button className="icon-button" type="submit" aria-label="Save category name">
                  Save
                </button>
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <button
                  className="category-option"
                  type="button"
                  aria-pressed={selectedCategory === category.id}
                  onClick={() => onSelect(category.id)}
                >
                  <span>{category.name}</span>
                </button>
                {!category.protected && (
                  <div className="category-actions">
                    <button
                      className="icon-button"
                      type="button"
                      aria-label={`Rename ${category.name}`}
                      onClick={() => {
                        setEditingId(category.id);
                        setEditingName(category.name);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="icon-button delete-category"
                      type="button"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => handleDelete(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <form className="category-add-form" onSubmit={handleAdd}>
        <label className="visually-hidden" htmlFor="new-category">
          New category name
        </label>
        <input
          id="new-category"
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
          placeholder="New category"
          maxLength={40}
        />
        <button type="submit" disabled={!newCategory.trim()}>
          Add
        </button>
      </form>
    </section>
  );
}
