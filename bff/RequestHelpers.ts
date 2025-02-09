import { Context } from "koa";
import joi from "joi";

export function ValidateBody<T>(ctx: Context, validator: joi.Schema<T>): Result<T> {
  const { value, error } = validator.validate(ctx.request.body, { abortEarly: false });

  if (error) {
    return { error, value: undefined };
  }

  return { error: undefined, value };
}

export type Result<T> = { error: undefined; value: T } | { error: Error; value: any };
