import { Context } from "koa";

export function SetBadRequest(ctx: Context, code?: string, message?: string): void {
  ctx.status = 400; // bad request
  ctx.body = { errors: [{ code, message }] };
}

export function SetOK(ctx: Context, body?: any): void {
  ctx.status = 200;
  ctx.body = body;
}
