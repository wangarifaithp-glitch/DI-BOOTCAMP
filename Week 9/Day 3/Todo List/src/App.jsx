import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, removeTodo, toggleTodo } from './todoStore.js';

function AddTodo() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  function handleSubmit(event) {
    event.preventDefault();
    const todoText = text.trim();
    if (!todoText) return;

    dispatch(addTodo(todoText));
    setText('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="new-todo">New todo</label>
      <input
        id="new-todo"
        type="text"
        value={text}
        maxLength={120}
        autoComplete="off"
        placeholder="What needs to get done?"
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit" disabled={!text.trim()}>Add todo</button>
    </form>
  );
}

function TodoItem({ todo }) {
  const dispatch = useDispatch();

  return (
    <li className={`todo-item${todo.completed ? ' is-complete' : ''}`}>
      <label className="todo-label">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => dispatch(toggleTodo(todo.id))}
        />
        <span>{todo.text}</span>
      </label>
      <button
        className="remove-button"
        type="button"
        aria-label={`Remove ${todo.text}`}
        onClick={() => dispatch(removeTodo(todo.id))}
      >
        Remove
      </button>
    </li>
  );
}

function TodoList() {
  const todos = useSelector((state) => state.todos);
  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <section className="list-card" aria-labelledby="todos-heading">
      <div className="list-heading">
        <div>
          <p className="eyebrow">YOUR LIST</p>
          <h2 id="todos-heading">Todos</h2>
        </div>
        <span className="remaining-count" aria-live="polite">
          {remainingCount} {remainingCount === 1 ? 'todo left' : 'todos left'}
        </span>
      </div>
      {todos.length > 0 ? (
        <ul className="todo-list">
          {todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
        </ul>
      ) : (
        <p className="empty-state">Your list is clear. Add a todo to begin.</p>
      )}
    </section>
  );
}

export default function App() {
  return (
    <main className="page">
      <header className="page-heading">
        <p className="eyebrow">A LITTLE MORE ORGANIZED</p>
        <h1>My todo list</h1>
        <p>Add a task, check it off, and keep moving.</p>
      </header>
      <AddTodo />
      <TodoList />
    </main>
  );
}
