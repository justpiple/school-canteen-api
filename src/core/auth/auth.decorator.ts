import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const AllowAnon = () => SetMetadata(IS_PUBLIC_KEY, true);

export const UseAuth = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
