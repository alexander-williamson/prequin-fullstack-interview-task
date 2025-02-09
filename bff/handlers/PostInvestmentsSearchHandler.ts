import joi from "joi";
import { Context, Middleware } from "koa";
import { SetBadRequest, SetOK } from "../ResponseHelpers";
import { GetInvestmentSummariesQueryHandler } from "../queries/GetInvestmentSummariesQueryHandler";
import { ValidateBody } from "../RequestHelpers";

const getInvestmentSummariesQueryHandler = new GetInvestmentSummariesQueryHandler();

export function PostInvestmentsSearchHandler(): Middleware {
  return async function Handler(ctx: Context): Promise<void> {
    const { error, value } = ValidateBody<PostInvestmentsSearchRequestBody>(ctx, requestBodyValidator);
    if (error) {
      SetBadRequest(ctx, "VALIDATION_ERROR", error.message);
      return;
    }
    const results = await getInvestmentSummariesQueryHandler.handle({
      investorIds: (value as PostInvestmentsSearchRequestBody).investorIds,
      paging: {
        pageOffset: (value as PostInvestmentsSearchRequestBody).paging?.pageOffset ?? 0,
        pageSize: (value as PostInvestmentsSearchRequestBody).paging?.pageSize ?? 15,
      },
    });
    const body: PostInvestmentsSearchResponseBody = {
      results: results.investments.map((item) => ({
        id: item.id,
        investorId: item.investorId,
        assetClass: item.assetClass,
        amount: item.amount,
        currency: item.currency,
      })),
      paging: {
        pageOffset: results.paging.pageOffset,
        pageSize: results.paging.pageSize,
        totalCount: results.paging.totalCount,
      },
    };

    SetOK(ctx, body);
  };
}

const requestBodyValidator = joi
  .object<PostInvestmentsSearchRequestBody>({
    investorIds: joi.array().items(joi.string().required()).min(1).required(),
    paging: joi
      .object({
        pageOffset: joi.number().min(0).required(),
        pageSize: joi.number().min(1).required(),
      })
      .optional(),
  })
  .required();

type PostInvestmentsSearchRequestBody = {
  investorIds: string[];
  paging?: {
    pageOffset: number;
    pageSize: number;
  };
};

type PostInvestmentsSearchResponseBody = {
  results: {
    id: string;
    investorId: string;
    assetClass: string;
    amount: number;
    currency: string;
  }[];
  paging: {
    pageOffset: number;
    pageSize: number;
    totalCount: number;
  };
};
