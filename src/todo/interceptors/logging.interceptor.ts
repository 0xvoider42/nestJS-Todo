import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('start interception');

    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent' || '');
    const { ip, method, path: url } = request;

    this.logger.log(
      `${method} ${ip} ${url} ${userAgent} : ${
        context.getClass().name
      } have been invoked`,
    );

    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `${method} ${url} ${userAgent} ${ip} it took: ${
              Date.now() - now
            }ms to complete`,
          ),
        ),
      );
  }
}
