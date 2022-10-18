import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    TodoModule,
  ],
})
export class AppModule {}
