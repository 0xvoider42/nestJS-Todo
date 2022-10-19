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
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent' || '');
    const { ip, method, path: url } = request;

    this.logger.log('Request inbound', { method, url, userAgent, ip });

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log('Request outbound', { method, url, userAgent, ip }),
        ),
      );
  }
}
