import { Injectable, Logger } from '@nestjs/common';
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

  async addTodo(title: string, text: string): Promise<string> {
    this.logger.log('Adding Todo', { title, text });

    const response = await this.todoRepository.nativeInsert({
      text,
      title,
    });

    this.logger.log('added todo to database', response);

    return `Created Todo: id: ${response}\n title: ${title}\n text: ${text}`;
  }

  async getTodos() {
    return await this.todoRepository.findAll();
  }

  async getATodo(todoId: number) {
    this.logger.log('Fetching a todo with id: ', todoId);

    return await this.todoRepository.findOne({ id: todoId });
  }

  async updateTodo(todoId: number, title: string, text: string) {
    this.logger.log('Updating a todo', { todoId, title, text });

    return await this.todoRepository.nativeUpdate(todoId, {
      title: title,
      text: text,
    });
  }

  async removeTodo(todoId: number) {
    this.logger.log('Removing todo with id: ', todoId);

    await this.todoRepository.nativeDelete(todoId);
    return `${todoId} has been deleted`;
  }
}
