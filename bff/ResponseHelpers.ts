import { Context } from "koa";

export function SetBadRequest(ctx: Context, code?: string, message?: string): void {
  ctx.status = 400; // Bad Request
  ctx.body = { errors: [{ code, message }] };
}

export function SetOK(ctx: Context, body?: any): void {
  ctx.status = 200; // OK
  ctx.body = body;
}

export function SetNotFound(ctx: Context, code: string = "NOT_FOUND", message?: string) {
  ctx.status = 404; // Not Found
  ctx.body = { errors: [{ code, message }] };
}
