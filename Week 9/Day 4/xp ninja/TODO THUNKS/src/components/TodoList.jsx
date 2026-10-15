import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeTodo, toggleTodo } from '../features/todos/todoSlice.js';

function TodoItem({ todo, index }) {
  const dispatch = useDispatch();

  return (
    <li className={`todo-item${todo.completed ? ' is-complete' : ''}`}>
      <button
        className="todo-check"
        type="button"
        aria-label={`${todo.completed ? 'Mark as incomplete' : 'Complete'}: ${todo.title}`}
        aria-pressed={todo.completed}
        onClick={() => dispatch(toggleTodo(todo.id))}
      >
        {todo.completed && <span aria-hidden="true">✓</span>}
      </button>
      <span className="todo-index">{String(index + 1).padStart(2, '0')}</span>
      <span className="todo-title">{todo.title}</span>
      <button
        className="remove-button"
        type="button"
        aria-label={`Remove ${todo.title}`}
        onClick={() => dispatch(removeTodo(todo.id))}
      >
        Remove
      </button>
    </li>
  );
}

export default function TodoList() {
  const { items: todos, status, error } = useSelector((state) => state.todos);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="list-state" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        <p>Gathering your tasks…</p>
      </div>
    );
  }

  if (status === 'failed') {
    return <p className="list-state error-message" role="alert">{error}</p>;
  }

  if (todos.length === 0) {
    return <p className="empty-state">Nothing on the list. Enjoy the breathing room.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo, index) => (
        <TodoItem key={todo.id} todo={todo} index={index} />
      ))}
    </ul>
  );
}
