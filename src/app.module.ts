import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { randomUUID } from 'crypto';

import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TodoModule } from './todo/todo.module';

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
