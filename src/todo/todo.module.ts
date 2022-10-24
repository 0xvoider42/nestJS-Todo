import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TodoEntity } from './entities/todo.entity';

@Module({
  imports: [MikroOrmModule.forFeature([TodoEntity])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
