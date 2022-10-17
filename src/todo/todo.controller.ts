import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { RequestValidationPipe } from '../common/pipes/validation.pipe';
import { addTodoBody, updateTodoBody } from '../common/todo-schema';

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
  getATodo(@Param('id') todoId: string) {
    return this.todoService.getATodo(todoId);
  }

  @Patch(':id')
  // @UsePipes(new RequestValidationPipe(updateTodoBody))
  updateTodo(@Param('id') todoId: string, @Body() body: UpdateTodoBody) {
    return this.todoService.updateTodo(todoId, body.title, body.text);
  }

  @Delete(':id')
  removeTodo(@Param('id') todoId: string) {
    return this.todoService.removeTodo(todoId);
  }
}
