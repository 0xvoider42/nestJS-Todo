import { HttpException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Todo } from './todo.model';

@Injectable()
export class TodoService {
  todos: Todo[] = [];

  addTodo(title: string, text: string): Todo {
    const todoId = randomUUID();
    const newTodo = new Todo(todoId, title, text);

    this.todos.push(newTodo);

    return newTodo;
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  getATodo(todoId: string): Todo {
    return this.findTodo(todoId).todo;
  }

  updateTodo(todoId: string, title: string, text: string): Todo {
    const { todo, index } = this.findTodo(todoId);

    todo.title = title || todo.title;
    todo.text = text ?? todo.text;

    this.todos[index] = todo;
    return todo;
  }

  private findTodo(todoId: string): { todo: Todo; index: number } {
    const todoIndex = this.todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex === -1) {
      throw new HttpException("didn't find the todo", 404);
    }

    return { todo: this.todos[todoIndex], index: todoIndex };
  }

  removeTodo(todoId: string): { id: string } {
    const { index } = this.findTodo(todoId);

    this.todos.splice(index, 1);

    return { id: todoId };
  }
}
