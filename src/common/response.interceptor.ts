import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface ApiResponse<T> {
  status: string;
  message: string;
  statusCode: number;
  data: T | null;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode || HttpStatus.OK;

        return {
          status: "success",
          message: "Operation successful",
          statusCode,
          data: data || null,
        };
      }),
    );
  }
}
