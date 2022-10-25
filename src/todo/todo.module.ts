import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TodoEntity } from './entities/todo.entity';

import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [MikroOrmModule.forFeature([TodoEntity])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
