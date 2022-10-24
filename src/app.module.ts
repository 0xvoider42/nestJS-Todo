import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: () => randomUUID(),
        autoLogging: false,
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
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
})
export class AppModule {}
