import {
  PipeTransform,
  Injectable,
  HttpException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

import { Todo } from '../../todo/todo.model';

@Injectable()
export class RequestValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: Todo, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      return value;
    }

    const { error } = this.schema.validate(value);

    if (error) {
      const errorMessage = error.details.map((err) => ({
        message: err.message,
        path: err.path,
      }));

      throw new HttpException(
        { message: 'Validation Failed', errors: errorMessage },
        400,
      );
    }

    return value;
  }
}
