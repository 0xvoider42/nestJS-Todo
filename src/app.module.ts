import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { TodoService } from './todo/todo.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            genReqId: randomUUID(),
          },
        },
      },
    }),
    TodoModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
})
export class AppModule {}
