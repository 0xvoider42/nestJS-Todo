import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoValidate } from '../common/pipes/todo-validate';

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
  // @UsePipes(new TodoValidate(updateTodoBody))
  async addTodo(@Body(new TodoValidate()) body: CreateTodoBody) {
    const generatedId = this.todoService.addTodo(body.title, body.text);
    return generatedId;
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
  updateTodo(@Param('id') todoId: string, @Body() body: UpdateTodoBody) {
    return this.todoService.updateTodo(todoId, body.title, body.text);
  }

  @Delete(':id')
  removeTodo(@Param('id') todoId: string) {
    this.todoService.removeTodo(todoId);
    return todoId;
  }
}
