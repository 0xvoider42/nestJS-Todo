import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';

import { addTodoBody, updateTodoBody } from './validation/todo-schema';
import { RequestValidationPipe } from '../common/pipes/validation.pipe';
import { TodoService } from './todo.service';

interface CreateTodoBody {
  title: string;
  text: string;
}

interface UpdateTodoBody {
  title: string;
  text: string;
}

@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  @UsePipes(new RequestValidationPipe(addTodoBody))
  addTodo(@Body() body: CreateTodoBody) {
    return this.todoService.addTodo(body.title, body.text);
  }

  @Get()
  getAllTodos() {
    return this.todoService.getTodos();
  }

  @Get(':id')
  getATodo(@Param('id', new ParseIntPipe()) todoId: number) {
    return this.todoService.getATodo(todoId);
  }

  @Patch(':id')
  @UsePipes(new RequestValidationPipe(updateTodoBody))
  updateTodo(
    @Param('id', new ParseIntPipe()) todoId: number,
    @Body() body: UpdateTodoBody,
  ) {
    return this.todoService.updateTodo(todoId, body.title, body.text);
  }

  @Delete(':id')
  removeTodo(@Param('id', new ParseIntPipe()) todoId: number) {
    return this.todoService.removeTodo(todoId);
  }
}
