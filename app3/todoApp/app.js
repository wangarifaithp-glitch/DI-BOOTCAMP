import { TodoList } from './todo.js';

const todoList = new TodoList();
todoList.addTask('Study Node.js modules');
todoList.addTask('Practice Express.js');
todoList.addTask('Review npm packages');
todoList.completeTask(1);

console.table(todoList.listTasks());
