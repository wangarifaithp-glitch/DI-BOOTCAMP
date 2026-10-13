import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addTask, deleteTask, editTask } from './actions';

function TaskList({ dayId, tasks, addTask, editTask, deleteTask }) {
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [error, setError] = useState('');

  function handleAdd(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) {
      setError('Write a task before adding it.');
      return;
    }
    if (text.length > 120) {
      setError('Keep tasks to 120 characters or fewer.');
      return;
    }
    addTask(dayId, text);
    setDraft('');
    setError('');
  }

  function beginEdit(task) {
    setEditingId(task.id);
    setEditingText(task.text);
    setError('');
  }

  function saveEdit(event) {
    event.preventDefault();
    const text = editingText.trim();
    if (!text) {
      setError('A task cannot be empty.');
      return;
    }
    if (text.length > 120) {
      setError('Keep tasks to 120 characters or fewer.');
      return;
    }
    editTask(dayId, editingId, text);
    setEditingId(null);
    setEditingText('');
    setError('');
  }

  function removeTask(taskId) {
    deleteTask(dayId, taskId);
    if (editingId === taskId) setEditingId(null);
    setError('');
  }

  return (
    <section className="tasks-panel" aria-labelledby="tasks-title">
      <div className="tasks-heading">
        <div>
          <p className="eyebrow">YOUR PLANS</p>
          <h2 id="tasks-title">The day, at a glance</h2>
        </div>
        <span className="task-total" aria-live="polite">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <form className="add-form" onSubmit={handleAdd}>
        <label className="sr-only" htmlFor="new-task">
          Add a task for this day
        </label>
        <span className="add-symbol" aria-hidden="true">+</span>
        <input
          id="new-task"
          type="text"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) setError('');
          }}
          placeholder="Add something to your day..."
          maxLength={120}
          autoComplete="off"
        />
        <button type="submit" disabled={!draft.trim()}>
          Add task
        </button>
      </form>

      {error && <p className="form-error" role="alert">{error}</p>}

      {tasks.length ? (
        <ul className="task-list">
          {tasks.map((task, index) => (
            <li className="task-row" key={task.id}>
              <span className="task-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              {editingId === task.id ? (
                <form className="edit-form" onSubmit={saveEdit}>
                  <label className="sr-only" htmlFor={`edit-${task.id}`}>
                    Edit task
                  </label>
                  <input
                    id={`edit-${task.id}`}
                    type="text"
                    value={editingText}
                    onChange={(event) => {
                      setEditingText(event.target.value);
                      if (error) setError('');
                    }}
                    maxLength={120}
                    autoFocus
                  />
                  <button className="save-button" type="submit">Save</button>
                  <button
                    className="cancel-button"
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setError('');
                    }}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span className="task-text">{task.text}</span>
                  <div className="task-actions">
                    <button
                      className="action-button"
                      type="button"
                      aria-label={`Edit ${task.text}`}
                      onClick={() => beginEdit(task)}
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="m12.5 4.5 3 3M4 16l3.5-.8 9-9a2.12 2.12 0 0 0-3-3l-9 9L4 16Z" />
                      </svg>
                    </button>
                    <button
                      className="action-button delete-action"
                      type="button"
                      aria-label={`Delete ${task.text}`}
                      onClick={() => removeTask(task.id)}
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M4.5 6h11m-9.5 0 .7 10h6.6l.7-10M8 6V4h4v2m-3 3v4m2-4v4" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            <svg viewBox="0 0 36 36">
              <path d="M11 18h14M18 11v14" />
              <circle cx="18" cy="18" r="14" />
            </svg>
          </span>
          <h3>A little open space</h3>
          <p>Add a task above to start shaping your day.</p>
        </div>
      )}

      <footer className="panel-footer">
        <span>Take it one thing at a time.</span>
        <span className="footer-mark"><span aria-hidden="true">✳</span> Make today yours</span>
      </footer>
    </section>
  );
}

const mapStateToProps = (state, ownProps) => ({
  dayId: ownProps.dayId,
  tasks: state.tasksByDay[ownProps.dayId] ?? [],
});

export default connect(mapStateToProps, {
  addTask,
  editTask,
  deleteTask,
})(TaskList);
