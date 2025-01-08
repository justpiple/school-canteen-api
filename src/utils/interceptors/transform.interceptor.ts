import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface ResponseTemplate<T> {
  message: string;
  result: T;
}

interface Response<T> {
  message: string;
  statusCode: number;
  result: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: ResponseTemplate<T>) => ({
        message: data.message,
        statusCode: context.switchToHttp().getResponse<{ statusCode: number }>()
          .statusCode,
        result: data.result,
      })),
    );
  }
}
