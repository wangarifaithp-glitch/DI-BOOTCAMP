const tasks = [];
const form = document.querySelector("#taskForm");
const input = document.querySelector("#taskInput");
const list = document.querySelector(".listTasks");
const emptyState = document.querySelector("#emptyState");
const taskCount = document.querySelector("#taskCount");
const progressText = document.querySelector("#progressText");

function updateSummary() {
  const completed = tasks.filter((task) => task.done).length;
  taskCount.textContent = tasks.length;
  progressText.textContent = `${tasks.length ? Math.round((completed / tasks.length) * 100) : 0}% COMPLETE`;
  emptyState.hidden = tasks.length > 0;
}

function doneTask(event) {
  const taskElement = event.target.closest(".task");
  const task = tasks.find((item) => item.task_id === Number(taskElement.dataset.taskId));
  task.done = event.target.checked;
  taskElement.classList.toggle("done", task.done);
  updateSummary();
}

function deleteTask(event) {
  const taskElement = event.currentTarget.closest(".task");
  const taskIndex = tasks.findIndex((task) => task.task_id === Number(taskElement.dataset.taskId));
  tasks.splice(taskIndex, 1);
  taskElement.remove();
  updateSummary();
}

function addTask(event) {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) { input.focus(); return; }
  const task = { task_id: tasks.length ? Math.max(...tasks.map((item) => item.task_id)) + 1 : 0, text, done: false };
  tasks.push(task);
  const taskElement = document.createElement("div");
  taskElement.className = "task";
  taskElement.dataset.taskId = task.task_id;
  taskElement.innerHTML = `<input id="task-${task.task_id}" type="checkbox"><label for="task-${task.task_id}">${task.text}</label><button class="delete" type="button" aria-label="Delete ${task.text}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`;
  taskElement.querySelector("input").addEventListener("change", doneTask);
  taskElement.querySelector(".delete").addEventListener("click", deleteTask);
  list.appendChild(taskElement);
  input.value = "";
  updateSummary();
  input.focus();
}

form.addEventListener("submit", addTask);
updateSummary();
