import { HttpException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Todo } from './todo.model';
import { TodoEntity } from './entities/todo.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: EntityRepository<TodoEntity>,
  ) {}

  private readonly logger = new Logger(TodoService.name);

  todos: Todo[] = [];

  async addTodo(title: string, text: string): Promise<Todo> {
    this.logger.log('Adding Todo', { title, text });

    const todoId = randomUUID();

    const todo = this.todoRepository.create({
      id: todoId,
      title,
      text,
    });

    this.todoRepository.persistAndFlush(todo);

    this.logger.log('Updated todo with id', { todo });

    return todo;
  }

  getTodos(): Todo[] {
    this.logger.log('Fetching todos list', this.todos);
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
