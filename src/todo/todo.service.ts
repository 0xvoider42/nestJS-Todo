import { Injectable } from '@nestjs/common';
import { Todo } from './todo.model';

@Injectable()
export class TodoService {
  todos: Todo[] = [];

  addTodo(title: string, todo: string): string {
    const todoId = Math.random().toFixed(10).toString();
    const newTodo = new Todo(todoId, title, todo);
    this.todos.push(newTodo);
    return todoId;
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  getATodo(todoId: string): {
    id: string;
    title: string;
    todo: string;
  } {
    const aTodo = this.findTodo(todoId)[0];
    return aTodo;
  }

  updateTodo(todoId: string, title: string, todo: string): void {
    const { todo: patchTodo, index: index } = this.findTodo(todoId);
    const updatedTodo = { ...patchTodo };
    if (title) {
      updatedTodo.title = title;
    }
    if (todo) {
      updatedTodo.todo = todo;
    }

    this.todos[index] = updatedTodo;
  }

  private findTodo(todoId: string): { todo: Todo; index: number } {
    const todoIndex = this.todos.findIndex((todo) => todo.id === todoId);
    const aTodo = this.todos[todoIndex];
    if (aTodo) {
      return { todo: aTodo, index: todoIndex };
    }
    if (!aTodo) {
      throw 404;
    }
  }

  removeTodo(todoId: string): void {
    const { todo: _, index: index } = this.findTodo(todoId);
    this.todos.splice(index);
  }
}
