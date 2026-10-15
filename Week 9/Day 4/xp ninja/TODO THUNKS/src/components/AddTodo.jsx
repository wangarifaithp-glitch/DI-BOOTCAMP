import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../features/todos/todoSlice.js';

export default function AddTodo() {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    dispatch(addTodo(trimmedTitle));
    setTitle('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="new-todo">Add a task</label>
      <input
        id="new-todo"
        value={title}
        maxLength={120}
        autoComplete="off"
        placeholder="What would you like to get done?"
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit" disabled={!title.trim()}>
        Add task <span aria-hidden="true">+</span>
      </button>
    </form>
  );
}
