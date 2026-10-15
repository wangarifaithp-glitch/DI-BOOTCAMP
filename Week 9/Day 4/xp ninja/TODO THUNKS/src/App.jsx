import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddTodo from './components/AddTodo.jsx';
import TodoList from './components/TodoList.jsx';
import { fetchTodos } from './features/todos/todoThunks.js';

export default function App() {
  const dispatch = useDispatch();
  const { items: todos, status } = useSelector((state) => state.todos);
  const completedCount = todos.filter((todo) => todo.completed).length;

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <main className="page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">A LITTLE CLARITY, EVERY DAY</p>
          <h1>Daybook<span>.</span></h1>
          <p className="intro">A calm place to collect what’s on your mind.</p>
        </div>
        <button
          className="reload-button"
          type="button"
          disabled={status === 'loading'}
          onClick={() => dispatch(fetchTodos())}
        >
          {status === 'loading' ? 'Syncing…' : 'Sync list'}
          <span aria-hidden="true">↻</span>
        </button>
      </header>

      <AddTodo />

      <section className="list-card" aria-labelledby="list-heading">
        <div className="list-header">
          <div>
            <p className="eyebrow">YOUR TASKS</p>
            <h2 id="list-heading">The list</h2>
          </div>
          <span className="progress-count" aria-live="polite">
            {completedCount} / {todos.length} done
          </span>
        </div>
        <TodoList />
      </section>
      <footer className="page-footer">Fetched from JSONPlaceholder · Your new tasks stay in this session</footer>
    </main>
  );
}
