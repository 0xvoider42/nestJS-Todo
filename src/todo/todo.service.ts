import { HttpException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Todo } from './todo.model';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  todos: Todo[] = [];

  addTodo(title: string, text: string): Todo {
    this.logger.log('Adding Todo', { title, text });

    const todoId = randomUUID();
    const newTodo = new Todo(todoId, title, text);

    this.todos.push(newTodo);

    this.logger.log('Updated todo with id', { newTodo });

    return newTodo;
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  getATodo(todoId: string): Todo {
    this.logger.log('Fetching a todo with id: ', todoId);

    return this.findTodo(todoId).todo;
  }

  updateTodo(todoId: string, title: string, text: string): Todo {
    this.logger.log('Updating a todo', { todoId, title, text });

    const { todo, index } = this.findTodo(todoId);

    todo.title = title || todo.title;
    todo.text = text ?? todo.text;

    this.todos[index] = todo;

    return todo;
  }

  private findTodo(todoId: string): { todo: Todo; index: number } {
    this.logger.log('Searching for todo with id: ', todoId);

    const todoIndex = this.todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex === -1) {
      throw new HttpException("didn't find the todo", 404);
    }

    return { todo: this.todos[todoIndex], index: todoIndex };
  }

  removeTodo(todoId: string): { id: string } {
    this.logger.log('Removing todo with id: ', todoId);

    const { index } = this.findTodo(todoId);

    this.todos.splice(index, 1);

    return { id: todoId };
  }
}
