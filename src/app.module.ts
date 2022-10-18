import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [LoggerModule.forRoot(), TodoModule],
})
export class AppModule {}
