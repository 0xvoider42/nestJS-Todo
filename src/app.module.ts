import { Module } from '@nestjs/common';
import { TodoModule } from './todo.module';

@Module({
  imports: [TodoModule],
})
export class AppModule {}
