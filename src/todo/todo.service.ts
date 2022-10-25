import { Injectable, Logger } from '@nestjs/common';
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

  async addTodo(title: string, text: string): Promise<Todo> {
    this.logger.log('Adding Todo', { title, text });

    const todo = this.todoRepository.create({
      title,
      text,
    });

    await this.todoRepository.persistAndFlush(todo);

    this.logger.log('added todo to database', todo.id);

    return todo;
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
    // const aTodo = await this.todoRepository.findOne({ id: todoId });

    return await this.todoRepository.nativeUpdate(todoId, {
      title: title,
      text: text,
    });

    // const update = await wrap(aTodo).assign(
    //   {
    //     title: title,
    //     text: text,
    //     updatedAt: new Date(),
    //   },
    //   { mergeObjects: true },
    // );

    // this.todoRepository.persistAndFlush(update);
  }

  async removeTodo(todoId: number) {
    this.logger.log('Removing todo with id: ', todoId);

    await this.todoRepository.nativeDelete(todoId);
    return `${todoId} has been deleted`;
  }
}
