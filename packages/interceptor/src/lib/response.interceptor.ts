import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

export interface Response {
    data: any;
    pager?: any,
    message: any;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
        return next.handle().pipe(map(data => ({
            data: data.length ? data : ['string', 'number'].includes(typeof data) ? null : { ...(_.omit(data, ['message', 'pager'])) },
            message: (['string', 'number'].includes(typeof data) ? data : _.pick(data, ['message']).message) || 'Success',
            pager: _.pick(data, ['pager']).pager || null,
        })));
    }
}