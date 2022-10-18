import { HttpException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Todo } from './todo.model';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  todos: Todo[] = [];

  addTodo(title: string, text: string): Todo {
    const todoId = randomUUID();
    const newTodo = new Todo(todoId, title, text);

    this.todos.push(newTodo);

    this.logger.log('Adding Todo', { title, text });

    return newTodo;
  }

  getTodos(): Todo[] {
    if (this.todos.length === 0) {
      throw new HttpException('No todos have been found', 404);
    }

    return this.todos;
  }

  getATodo(todoId: string): Todo {
    this.logger.log('Fetching a todo with id: ', todoId);

    return this.findTodo(todoId).todo;
  }

  updateTodo(todoId: string, title: string, text: string): Todo {
    const { todo, index } = this.findTodo(todoId);

    todo.title = title || todo.title;
    todo.text = text ?? todo.text;

    this.todos[index] = todo;

    this.logger.log('Updating a todo', { todoId, title, text });

    return todo;
  }

  private findTodo(todoId: string): { todo: Todo; index: number } {
    const todoIndex = this.todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex === -1) {
      throw new HttpException("didn't find the todo", 404);
    }

    this.logger.log('Searching for todo with id: ', todoId);

    return { todo: this.todos[todoIndex], index: todoIndex };
  }

  removeTodo(todoId: string): { id: string } {
    const { index } = this.findTodo(todoId);

    this.todos.splice(index, 1);

    this.logger.log('Removing todo with id: ', todoId);

    return { id: todoId };
  }
}
