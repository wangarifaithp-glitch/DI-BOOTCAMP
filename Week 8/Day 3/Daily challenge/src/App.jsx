import { useEffect, useReducer, useRef, useState } from 'react'

const initialState = {
  tasks: [
    { id: 'task-1', text: 'Review today’s React notes', completed: false },
    { id: 'task-2', text: 'Build a task manager with useReducer', completed: true },
    { id: 'task-3', text: 'Practice editing tasks with useRef', completed: false },
  ],
  filter: 'all',
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [action.task, ...state.tasks] }
    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, text: action.text } : task,
        ),
      }
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task,
        ),
      }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.id) }
    case 'FILTER_TASKS':
      return { ...state, filter: action.filter }
    default:
      return state
  }
}

const filters = [
  { id: 'all', label: 'All tasks' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  const [newTask, setNewTask] = useState('')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editError, setEditError] = useState('')
  const editInputRef = useRef(null)

  const activeCount = state.tasks.filter((task) => !task.completed).length
  const completedCount = state.tasks.length - activeCount
  const visibleTasks = state.tasks.filter((task) => {
    if (state.filter === 'active') return !task.completed
    if (state.filter === 'completed') return task.completed
    return true
  })

  useEffect(() => {
    if (editingTaskId !== null) {
      editInputRef.current?.focus()
      editInputRef.current?.select()
    }
  }, [editingTaskId])

  const addTask = (event) => {
    event.preventDefault()
    const text = newTask.trim()
    if (!text) return

    dispatch({
      type: 'ADD_TASK',
      task: { id: crypto.randomUUID(), text, completed: false },
    })
    setNewTask('')
  }

  const startEditing = (task) => {
    setEditError('')
    setEditingTaskId(task.id)
  }

  const saveTask = (event, id) => {
    event.preventDefault()
    const text = editInputRef.current?.value.trim() ?? ''
    if (!text) {
      setEditError('A task description cannot be empty.')
      editInputRef.current?.focus()
      return
    }

    dispatch({ type: 'EDIT_TASK', id, text })
    setEditingTaskId(null)
    setEditError('')
  }

  const cancelEditing = () => {
    setEditingTaskId(null)
    setEditError('')
  }

  return (
    <main className="app-shell">
      <header className="page-heading">
        <h1>Task Manager<span>.</span></h1>
        <p className="intro">Capture your next steps, then keep your list up to date.</p>
      </header>

      <section className="task-panel" aria-label="Task manager">
        <form className="add-task-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="new-task">New task</label>
          <input
            id="new-task"
            className="task-input"
            type="text"
            value={newTask}
            onChange={(event) => setNewTask(event.currentTarget.value)}
            placeholder="What needs to get done?"
            maxLength={160}
            required
          />
          <button className="primary-button" type="submit">Add task</button>
        </form>

        <div className="list-toolbar">
          <div className="filter-group" role="group" aria-label="Filter tasks">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-button${state.filter === filter.id ? ' selected' : ''}`}
                type="button"
                aria-pressed={state.filter === filter.id}
                onClick={() => dispatch({ type: 'FILTER_TASKS', filter: filter.id })}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <p className="task-summary" aria-live="polite">
            {activeCount} active <span>·</span> {completedCount} completed
          </p>
        </div>

        {visibleTasks.length > 0 ? (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li className={`task-row${task.completed ? ' is-complete' : ''}`} key={task.id}>
                {editingTaskId === task.id ? (
                  <form className="edit-form" onSubmit={(event) => saveTask(event, task.id)}>
                    <label className="sr-only" htmlFor={`edit-${task.id}`}>Edit task</label>
                    <input
                      ref={editInputRef}
                      id={`edit-${task.id}`}
                      className="task-input edit-input"
                      type="text"
                      defaultValue={task.text}
                      maxLength={160}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') cancelEditing()
                      }}
                    />
                    <div className="row-actions">
                      <button className="text-button save-button" type="submit">Save</button>
                      <button className="text-button" type="button" onClick={cancelEditing}>Cancel</button>
                    </div>
                    {editError && <p className="edit-error" role="alert">{editError}</p>}
                  </form>
                ) : (
                  <>
                    <label className="task-label">
                      <input
                        className="task-checkbox"
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => dispatch({ type: 'TOGGLE_TASK', id: task.id })}
                      />
                      <span className="task-text">{task.text}</span>
                    </label>
                    <div className="row-actions">
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => startEditing(task)}
                        aria-label={`Edit ${task.text}`}
                      >
                        Edit
                      </button>
                      <button
                        className="text-button delete-button"
                        type="button"
                        onClick={() => dispatch({ type: 'DELETE_TASK', id: task.id })}
                        aria-label={`Delete ${task.text}`}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">✓</span>
            <h2>{state.tasks.length === 0 ? 'Your list is clear' : `No ${state.filter} tasks`}</h2>
            <p>
              {state.tasks.length === 0
                ? 'Add a task above to get started.'
                : 'Try another filter or add a new task.'}
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
