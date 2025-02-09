import { InvestorSummary } from "../models/InvestorSummary";
import { InvestorsSummaryRepository } from "../repositories/InvestorsSummaryRepository";
import { IQueryHander } from "./IQueryHandler";

const investorsSummaryRepository = new InvestorsSummaryRepository();

export class GetDashboardDataQueryHandler implements IQueryHander<Query, Result> {
  async handle(_: Query): Promise<Result> {
    const investorSummaries = await investorsSummaryRepository.GetInvestorSummaries();
    return {
      investors: investorSummaries,
    };
  }
}

type Query = {};
type Result = {
  investors: InvestorSummary[];
};
