import joi from "joi";
import { Context, Middleware } from "koa";
import { GetInvestorSummaryQueryHandler } from "../queries/GetInvestorSummaryQueryHandler";
import { ValidateParams } from "../RequestHelpers";
import { SetBadRequest, SetNotFound, SetOK } from "../ResponseHelpers";

const getInvestorSummaryQueryHandler = new GetInvestorSummaryQueryHandler();

export function GetInvestorHandler(): Middleware {
  return async function Handler(ctx: Context): Promise<void> {
    const { error, value } = ValidateParams<Params>(ctx, paramsValidator);
    if (error) {
      SetBadRequest(ctx, "INVALID_PARAMS");
      return;
    }
    const result = await getInvestorSummaryQueryHandler.handle({ investorId: value.id });
    if (result.success === false) {
      SetNotFound(ctx);
      return;
    }
    const body: GetInvestorsResponseBody = {
      dateAdded: result.investorSummary.dateAdded,
      id: result.investorSummary.id,
      lastUpdated: result.investorSummary.lastUpdated,
      name: result.investorSummary.name,
      summaries: {
        assets: result.aggregations.assetClass.map((item) => ({
          amount: item.totalAmount,
          name: item.assetClass,
        })),
      },
      totalCommitments: result.investorSummary.totalCommitments,
      type: result.investorSummary.type,
    };
    SetOK(ctx, body);
  };
}

const paramsValidator = joi.object<Params>({ id: joi.string().required() }).required();

type Params = {
  id: string;
};

type GetInvestorsResponseBody = {
  id: string;
  name: string;
  type: string;
  dateAdded: Date;
  lastUpdated: Date;
  totalCommitments: number;
  summaries: {
    assets: { name: string; amount: number }[];
  };
};
