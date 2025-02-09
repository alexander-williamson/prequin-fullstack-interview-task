import { Context, Middleware } from "koa";
import { GetDashboardDataQueryHandler } from "../queries/GetDashboardDataQueryHandler";
import { SetOK } from "../ResponseHelpers";

const getDashboardDataQueryHandler = new GetDashboardDataQueryHandler();

export function GetDashboardHandler(): Middleware {
  return async function Handler(ctx: Context): Promise<void> {
    const results = await getDashboardDataQueryHandler.handle({});

    const body: ResponseBody = {
      investors: results.investors.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        dateAdded: item.dateAdded,
        lastUpdated: item.lastUpdated,
        totalCommitments: item.totalCommitments,
      })),
    };

    SetOK(ctx, body);
  };
}

type ResponseBody = {
  investors: { id: string; name: string; type: string; dateAdded: Date; lastUpdated: Date; totalCommitments: number }[];
};
