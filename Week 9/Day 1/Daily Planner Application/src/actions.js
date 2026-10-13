export const ADD_TASK = 'planner/addTask';
export const EDIT_TASK = 'planner/editTask';
export const DELETE_TASK = 'planner/deleteTask';

function validateDayId(dayId) {
  if (
    typeof dayId !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dayId) ||
    Number.isNaN(Date.parse(`${dayId}T00:00:00`))
  ) {
    throw new TypeError('A valid calendar date is required.');
  }
}

function validateTaskText(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new TypeError('Task details cannot be empty.');
  }
  if (text.trim().length > 120) {
    throw new RangeError('Task details must be 120 characters or fewer.');
  }
  return text.trim();
}

export function addTask(dayId, text) {
  validateDayId(dayId);
  return {
    type: ADD_TASK,
    payload: {
      dayId,
      task: {
        id: crypto.randomUUID(),
        text: validateTaskText(text),
      },
    },
  };
}

export function editTask(dayId, taskId, text) {
  validateDayId(dayId);
  if (typeof taskId !== 'string' || !taskId) {
    throw new TypeError('A task identifier is required.');
  }
  return {
    type: EDIT_TASK,
    payload: {
      dayId,
      taskId,
      text: validateTaskText(text),
    },
  };
}

export function deleteTask(dayId, taskId) {
  validateDayId(dayId);
  if (typeof taskId !== 'string' || !taskId) {
    throw new TypeError('A task identifier is required.');
  }
  return {
    type: DELETE_TASK,
    payload: { dayId, taskId },
  };
}
