import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Todo } from './todo.model';
import { TodoEntity } from './entities/todo.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { wrap } from '@mikro-orm/core';

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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.todoRepository.persistAndFlush(todo);

    this.logger.log('Updated todo with id', { todo });

    return todo;
  }

  async getTodos() {
    this.logger.log('Fetching todos list', this.todos);

    const todos = await this.todoRepository.findAll();

    return todos;
  }

  async getATodo(todoId: string) {
    this.logger.log('Fetching a todo with id: ', todoId);

    const aTodo = await this.todoRepository.findOne({ id: todoId });

    return aTodo;
  }

  async updateTodo(todoId: string, title: string, text: string) {
    this.logger.log('Updating a todo', { todoId, title, text });
    const aTodo = await this.todoRepository.findOne({ id: todoId });

    const update = await wrap(aTodo).assign(
      {
        title: title,
        text: text,
        updatedAt: new Date(),
      },
      { mergeObjects: true },
    );

    this.todoRepository.persistAndFlush(update);

    return update;
  }

  async removeTodo(todoId: string) {
    this.logger.log('Removing todo with id: ', todoId);

    const getTodo = await this.todoRepository.findOne({ id: todoId });
    const removeTodo = await this.todoRepository.removeAndFlush(getTodo);

    return removeTodo;
  }
}
