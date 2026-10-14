import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, deleteTask, editTask } from '../Daily challenge/Aplication planner.js';

const EMPTY_TASKS = [];

function toDayId(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function DatePicker({ dayId, onChange }) {
  const dateLabel = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dayId}T12:00:00`));

  function shiftDay(amount) {
    const date = new Date(`${dayId}T12:00:00`);
    date.setDate(date.getDate() + amount);
    onChange(toDayId(date));
  }

  return (
    <section className="date-card" aria-label="Choose a planning date">
      <div>
        <p className="eyebrow">PLAN YOUR DAY</p>
        <h2>{dateLabel}</h2>
      </div>
      <div className="date-controls">
        <button
          className="icon-button"
          type="button"
          aria-label="Previous day"
          onClick={() => shiftDay(-1)}
        >
          ‹
        </button>
        <label className="visually-hidden" htmlFor="planner-date">Select a date</label>
        <input
          id="planner-date"
          type="date"
          value={dayId}
          onChange={(event) => {
            if (event.target.value) onChange(event.target.value);
          }}
        />
        <button
          className="icon-button"
          type="button"
          aria-label="Next day"
          onClick={() => shiftDay(1)}
        >
          ›
        </button>
        <button
          className="today-button"
          type="button"
          onClick={() => onChange(toDayId(new Date()))}
        >
          Today
        </button>
      </div>
    </section>
  );
}

function AddTask({ dayId }) {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  function handleSubmit(event) {
    event.preventDefault();
    const taskText = text.trim();
    if (!taskText) return;

    dispatch(addTask({ dayId, text: taskText }));
    setText('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="new-task">
        Add a task for this day
      </label>
      <input
        id="new-task"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="What would you like to get done?"
        maxLength={120}
        autoComplete="off"
      />
      <button type="submit" disabled={!text.trim()}>
        Add task
      </button>
    </form>
  );
}

function DeleteTask({ dayId, taskId, taskText }) {
  const dispatch = useDispatch();

  return (
    <button
      className="remove-button"
      type="button"
      aria-label={`Delete ${taskText}`}
      onClick={() => dispatch(deleteTask({ dayId, taskId }))}
    >
        Delete
      </button>
  );
}

function EditTask({ dayId, task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  function saveTask(event) {
    event.preventDefault();
    const taskText = text.trim();
    if (!taskText) {
      setError('A task cannot be empty.');
      return;
    }

    dispatch(editTask({ dayId, taskId: task.id, text: taskText }));
    setIsEditing(false);
    setError('');
  }

  function cancelEdit() {
    setText(task.text);
    setIsEditing(false);
    setError('');
  }

  if (!isEditing) {
    return (
      <>
        <span className="task-text">{task.text}</span>
        <div className="task-actions">
          <button
            className="edit-button"
            type="button"
            aria-label={`Edit ${task.text}`}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <DeleteTask dayId={dayId} taskId={task.id} taskText={task.text} />
        </div>
      </>
    );
  }

  return (
    <form className="edit-form" onSubmit={saveTask}>
      <label className="visually-hidden" htmlFor={`edit-${task.id}`}>Edit task</label>
      <input
        id={`edit-${task.id}`}
        value={text}
        maxLength={120}
        autoFocus
        onChange={(event) => {
          setText(event.target.value);
          setError('');
        }}
      />
      <button className="save-button" type="submit">Save</button>
      <button className="cancel-button" type="button" onClick={cancelEdit}>
        Cancel
      </button>
      {error && <span className="form-error" role="alert">{error}</span>}
    </form>
  );
}

function TaskList({ dayId }) {
  const tasks = useSelector((state) => state.tasksByDay[dayId] ?? EMPTY_TASKS);

  return (
    <section className="list-card" aria-labelledby="tasks-heading">
      <div className="list-heading">
        <div>
          <p className="eyebrow">YOUR PLANS</p>
          <h2 id="tasks-heading">Tasks for this day</h2>
        </div>
        <span className="task-count" aria-live="polite">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>
      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task, index) => (
            <li className="task-row" key={task.id}>
              <span className="task-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <EditTask dayId={dayId} task={task} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">Nothing planned yet. Add a task to start shaping your day.</p>
      )}
    </section>
  );
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState(() => toDayId(new Date()));

  return (
    <main className="page">
      <header className="page-heading">
        <p className="eyebrow">A MOMENT FOR YOU</p>
        <h1>Give your day<br />a little direction.</h1>
        <p>Gather your thoughts. Choose what matters. Begin anywhere.</p>
      </header>
      <DatePicker dayId={selectedDay} onChange={setSelectedDay} />
      <AddTask key={selectedDay} dayId={selectedDay} />
      <TaskList dayId={selectedDay} />
    </main>
  );
}
