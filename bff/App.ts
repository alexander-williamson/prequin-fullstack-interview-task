import cors from "@koa/cors";
import Router from "@koa/router";
import Koa, { Context, Next } from "koa";
import bodyParser from "koa-bodyparser";
import { configuration } from "./Configuration";
import { SetOK } from "./ResponseHelpers";
import { GetDashboardHandler } from "./handlers/GetDashboardHandler";

const app = new Koa();

// middlware
app.use(bodyParser());
app.use(cors({ origin: configuration.ORIGIN, credentials: true }));
app.use(async (ctx: Context, next: Next) => {
  // preflight patch (koa-cors bug)
  ctx.set("Access-Control-Allow-Origin", configuration.ORIGIN);
  await next();
});

// handlers
const router = new Router({});
router.get("/v1/dashboard", GetDashboardHandler());
router.post("/v1/investments/search", (ctx: Context) => {
  SetOK(ctx, {});
});
app.use(router.routes()).use(router.allowedMethods());

export default app;
