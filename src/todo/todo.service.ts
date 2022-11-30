import { Injectable, Logger } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';

import { TodoEntity } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: EntityRepository<TodoEntity>,
  ) {}

  private readonly logger = new Logger(TodoService.name);

  async addTodo(title: string, text: string): Promise<number> {
    this.logger.log('Adding Todo', { title, text });

    const response = await this.todoRepository.nativeInsert({
      title,
      text,
    });

    this.logger.log('added todo to database', response);

    return response;
  }

  async getTodos(): Promise<TodoEntity[]> {
    const todos = await this.todoRepository.findAll();

    this.logger.log('Fetching list of todos', todos);

    return todos;
  }

  async getATodo(todoId: number): Promise<TodoEntity> {
    this.logger.log('Fetching a todo with id: ', todoId);

    return this.todoRepository.findOne({ id: todoId });
  }

  async updateTodo(
    todoId: number,
    title: string,
    text: string,
  ): Promise<number> {
    this.logger.log('Updating a todo', { todoId, title, text });

    await this.todoRepository.nativeUpdate(todoId, {
      title: title,
      text: text,
    });

    return todoId;
  }

  async removeTodo(todoId: number): Promise<number> {
    this.logger.log('Removing todo with id: ', todoId);

    await this.todoRepository.nativeDelete(todoId);

    return todoId;
  }
}
