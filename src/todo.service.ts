import { Injectable } from '@nestjs/common';
import { Todo } from './todo.model';

@Injectable()
export class TodoService {
  todos: Todo[] = [];

  addTodo(title: string, text: string): Todo {
    const todoId = Math.random().toFixed(10).toString();
    const newTodo = new Todo(todoId, title, text);
    // if (newTodo.text === undefined) {
    //   throw 500;
    // }
    this.todos.push(newTodo);
    return newTodo;
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  getATodo(todoId: string): Todo {
    return this.findTodo(todoId).todo;
  }

  updateTodo(
    todoId: string,
    title: string,
    text: string,
  ): {
    id: string;
    title: string;
    text: string;
  } {
    const { todo, index } = this.findTodo(todoId);

    todo.title = title || todo.title;
    todo.text = text ?? todo.text;

    this.todos[index] = todo;
    return this.todos[index];
  }

  private findTodo(todoId: string): { todo: Todo; index: number } {
    const todoIndex = this.todos.findIndex((todo) => todo.id === todoId);
    if (todoIndex === -1) {
      throw 404;
    }
    return { todo: this.todos[todoIndex], index: todoIndex };
  }

  removeTodo(todoId: string): void {
    const { index } = this.findTodo(todoId);
    this.todos.splice(index, 1);
  }
}
