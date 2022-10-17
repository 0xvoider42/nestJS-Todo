import { PipeTransform, Injectable, HttpException } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { Todo } from '../../todo/todo.model';

@Injectable()
export class RequestValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: Todo) {
    console.log('Value', value);
    const { error } = this.schema.validate(value);

    if (error) {
      const errorMessage = error.details.map((err) => [
        { message: err.message, path: err.path },
      ]);

      throw new HttpException(
        { message: 'Validation Failed', errors: errorMessage.flat() },
        500,
      );
    }

    return value;
  }
}
