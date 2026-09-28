export class TodoList {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push({ task, completed: false });
  }

  completeTask(taskNumber) {
    const task = this.tasks[taskNumber - 1];
    if (!task) {
      throw new Error('Task not found.');
    }
    task.completed = true;
  }

  listTasks() {
    return this.tasks;
  }
}
