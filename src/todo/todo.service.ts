import { Injectable } from '@nestjs/common';
import { Todo } from './todo.model';

@Injectable()
export class TodoService {
  todos: Todo[] = [];

  addTodo(title: string, todo: string) {
    const todoId = Math.random().toFixed(10).toString();
    const newTodo = new Todo(todoId, title, todo);
    this.todos.push(newTodo);
    return todoId;
  }

  getTodos() {
    return [...this.todos];
  }

  getATodo(todoId: string) {
    const aTodo = this.findTodo(todoId)[0];
    return { ...aTodo };
  }

  updateTodo(todoId: string, title: string, todo: string) {
    const [patchTodo, index] = this.findTodo(todoId);
    const updatedTodo = { ...patchTodo };
    if (title) {
      updatedTodo.title = title;
    }
    if (todo) {
      updatedTodo.todo = todo;
    }

    this.todos[index] = updatedTodo;
  }

  private findTodo(id: string): [Todo, number] {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    const aTodo = this.todos[todoIndex];
    if (!aTodo) {
      throw new Error('invalid ID');
    }
    return [aTodo, todoIndex];
  }

  removeTodo(todoId: string) {
    const [_, index] = this.findTodo(todoId);
    this.todos.splice(index);
  }
}
