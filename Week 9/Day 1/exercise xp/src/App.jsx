import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addTodo, removeTodo, toggleTodo } from './actions';

const filters = ['all', 'active', 'completed'];

function App({ todos, addTodo, toggleTodo, removeTodo }) {
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState('all');
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  function handleSubmit(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    addTodo(text);
    setDraft('');
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Daylight home">
          <span className="wordmark-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3.5v2M12 18.5v2M3.5 12h2m13 0h2M5.99 5.99l1.42 1.42m9.18 9.18 1.42 1.42m0-12.02-1.42 1.42m-9.18 9.18-1.42 1.42"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="4" fill="currentColor" />
            </svg>
          </span>
          <span>daylight</span>
        </a>
        <span className="topbar-note">A little progress, every day.</span>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">YOUR PERSONAL SPACE</p>
          <h1 id="page-title">Make room for<br />what matters.</h1>
          <p className="intro-copy">
            Keep your day clear, focused, and moving forward.
          </p>
        </div>
        <div className="sunrise-art" aria-hidden="true">
          <span className="sunrise-sun" />
          <span className="sunrise-hill sunrise-hill-back" />
          <span className="sunrise-hill sunrise-hill-front" />
          <span className="sunrise-spark spark-one">✦</span>
          <span className="sunrise-spark spark-two">✦</span>
        </div>
      </section>

      <section className="task-card" aria-label="Todo list">
        <div className="card-heading">
          <div>
            <p className="eyebrow">YOUR DAY</p>
            <h2>My tasks</h2>
          </div>
          <div className="task-count" aria-live="polite">
            <span>{activeCount}</span>
            <span>{activeCount === 1 ? 'task left' : 'tasks left'}</span>
          </div>
        </div>

        <form className="add-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="new-task">
            Add a task
          </label>
          <span className="add-plus" aria-hidden="true">+</span>
          <input
            id="new-task"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="What needs to get done?"
            maxLength={120}
            autoComplete="off"
          />
          <button type="submit" disabled={!draft.trim()}>
            Add task
          </button>
        </form>

        <div className="list-toolbar">
          <div className="filters" role="group" aria-label="Filter tasks">
            {filters.map((option) => (
              <button
                className={`filter-button${filter === option ? ' is-selected' : ''}`}
                type="button"
                key={option}
                aria-pressed={filter === option}
                onClick={() => setFilter(option)}
              >
                {option[0].toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          {completedCount > 0 && (
            <span className="completed-summary">
              {completedCount} completed
            </span>
          )}
        </div>

        {visibleTodos.length > 0 ? (
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <li className={`todo-row${todo.completed ? ' is-complete' : ''}`} key={todo.id}>
                <button
                  className="todo-check"
                  type="button"
                  aria-label={`${todo.completed ? 'Mark as active' : 'Mark as completed'}: ${todo.text}`}
                  aria-pressed={todo.completed}
                  onClick={() => toggleTodo(todo.id)}
                >
                  {todo.completed && (
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="m3.5 8 3 3 6-6" />
                    </svg>
                  )}
                </button>
                <span className="todo-text">{todo.text}</span>
                <button
                  className="remove-button"
                  type="button"
                  aria-label={`Remove ${todo.text}`}
                  onClick={() => removeTodo(todo.id)}
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5 5l10 10M15 5 5 15" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">
              {filter === 'completed' ? '✧' : '☼'}
            </span>
            <h3>
              {filter === 'all'
                ? 'A fresh start'
                : filter === 'active'
                  ? 'Nothing on your list'
                  : 'No finished tasks yet'}
            </h3>
            <p>
              {filter === 'all'
                ? 'Add a task above and take the first small step.'
                : filter === 'active'
                  ? 'You’re all caught up. Enjoy the breathing room.'
                  : 'Completed tasks will be waiting here.'}
            </p>
          </div>
        )}

        <footer className="card-footer">
          <span>
            {todos.length === 0
              ? 'One step at a time.'
              : `${todos.length} ${todos.length === 1 ? 'task' : 'tasks'} in your list`}
          </span>
          <span className="footer-spark">Made for a clearer day <span aria-hidden="true">✳</span></span>
        </footer>
      </section>

      <p className="page-footer">Small steps add up to lovely things.</p>
    </main>
  );
}

const mapStateToProps = (todos) => ({ todos });

export default connect(mapStateToProps, {
  addTodo,
  toggleTodo,
  removeTodo,
})(App);
