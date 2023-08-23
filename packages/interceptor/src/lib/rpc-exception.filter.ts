import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

@Catch(RpcException)
export class RPCExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger: Logger;

  constructor(stack: string) {
    this.logger = new Logger(stack);
  }

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const context = host.switchToRpc();
    const contextHttp = host.switchToHttp();
    const pattern = context.getContext().getPattern();
    const request = contextHttp.getRequest<Request>();

    const details = {
      message: exception.message,
      transactionId: `${randomUUID()}`,
      name: exception.name,
      pattern: pattern,
      error: exception.stack,
    };

    const response = {
      method: request.method,
      path: request.url,
      details,
      timestamp: new Date().toISOString(),
    };

    this.logger.error('Error Encountered.', response);

    return throwError(() => {
      return details;
    });
  }
}
