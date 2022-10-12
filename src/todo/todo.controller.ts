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

@Controller('todos')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post()
  addTodo(@Body('title') todoTitle: string, @Body('todo') todoText: string) {
    const generatedId = this.todoService.addTodo(todoTitle, todoText);
    return `The todo has been added by ID: ${generatedId}`;
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
  updateTodo(
    @Param('id') todoId: string,
    @Body('title') todoTitle: string,
    @Body('todo') todoText: string,
  ) {
    this.todoService.updateTodo(todoId, todoTitle, todoText);
    return 'Update successful';
  }

  @Delete(':id')
  removeTodo(@Param('id') todoId: string) {
    this.todoService.removeTodo(todoId);
    return 'Todo removed';
  }
}
