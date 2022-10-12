import { Injectable } from '@nestjs/common';
import { Todo } from './todo.model';

@Injectable()
export class TodoService {
  todos: Todo[] = [];

  addTodo(title: string, text: string): string {
    const todoId = Math.random().toFixed(10).toString();
    const newTodo = new Todo(todoId, title, text);
    this.todos.push(newTodo);
    return todoId;
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  getATodo(todoId: string) {
    const aTodo = this.findTodo(todoId).index;
    return aTodo;
  }

  updateTodo(todoId: string, title: string, text: string): void {
    const { todo, index } = this.findTodo(todoId);
    if (title) {
      todo.title = title;
    }
    if (text) {
      todo.text = text;
    }

    this.todos[index] = todo;
  }

  private findTodo(todoId: string): { todo: Todo; index: number } {
    const todoIndex = this.todos.findIndex((todo) => todo.id === todoId);
    if (todoIndex == -1) {
      throw 404;
    } else {
      const aTodo = this.todos[todoIndex];
      return { todo: aTodo, index: todoIndex };
    }
  }

  removeTodo(todoId: string): void {
    const { index } = this.findTodo(todoId);
    this.todos.splice(index, index);
  }
}
