import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Todo } from 'src/todo/todo.model';
import { updateTodoBody } from '../todo-schema';

@Injectable()
export class TodoValidate implements PipeTransform {
  transform(value: Todo) {
    const { error } = updateTodoBody.validate(value);
    if (error) {
      const errorMessage = error.details.map((err) => [
        { message: err.message, path: err.path },
      ]);

      throw errorMessage;
    }
    return value;
  }
}
