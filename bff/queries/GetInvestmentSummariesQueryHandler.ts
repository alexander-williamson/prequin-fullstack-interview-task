import { InvestmentSummary } from "../models/InvestmentSummary";
import { InvestmentSummaryRepository } from "../repositories/InvestmentSummaryRepository";
import { IQueryHander } from "./IQueryHandler";

const investmentSummaryRepository = new InvestmentSummaryRepository();

export class GetInvestmentSummariesQueryHandler implements IQueryHander<Query, Result> {
  public async handle(query: Query): Promise<Result> {
    const investmentSummaries = await investmentSummaryRepository.FindSummaries({
      investorIds: query.investorIds,
      pageOffset: query.paging.pageOffset,
      pageSize: query.paging.pageSize,
    });
    return {
      investments: investmentSummaries.results,
      paging: {
        pageOffset: query.paging.pageOffset,
        pageSize: query.paging.pageSize,
        totalCount: investmentSummaries.totalCount,
      },
    };
  }
}

type Query = {
  investorIds: string[];
  paging: {
    pageOffset: number;
    pageSize: number;
  };
};

type Result = {
  investments: InvestmentSummary[];
  paging: {
    pageOffset: number;
    pageSize: number;
    totalCount: number;
  };
};
