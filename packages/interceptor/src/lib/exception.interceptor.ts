import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { randomUUID } from 'crypto';

@Catch()
export class ExceptionInterceptor implements ExceptionFilter {
    private readonly logger;

    constructor(stack: string) {
        this.logger = new Logger(stack);
    }

    catch(exception: any, host: ArgumentsHost): void {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();
        const status =
            typeof exception.getStatus === 'function'
                ? exception.getStatus()
                : HttpStatus.FORBIDDEN;

        const responseBody = {
            method: request.method,
            path: request.url,
            details: exception,
            timestamp: new Date().toISOString(),
        };
        responseBody.details.status = status;

        // custom response for class-validator
        if (responseBody.details?.response) {
            responseBody.details = {
                message: responseBody.details?.response?.message,
                transactionId: randomUUID,
                name: 'class-validator',
                pattern: '',
                error: 'Error: class-validator',
                status: HttpStatus.BAD_REQUEST,
            };
        }

        this.logger.error('Error Encountered.', responseBody);
        response.status(status).json(responseBody);
    }
}
