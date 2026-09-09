import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const started = Date.now();
        const { method, url } = context.switchToHttp().getRequest();
        
        return next.handle().pipe(
            tap(() => {
                const { statusCode } = context.switchToHttp().getResponse();
                console.log(`${method} ${url} ${statusCode} — ${Date.now() - started} ms`);
            }),
            catchError((error: any) => {
                const statusCode = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
                console.log(`${method} ${url} ${statusCode} — ${Date.now() - started} ms`);
                return throwError(() => error);
              }),
        );
    }
}