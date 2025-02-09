import { AssetClassAggregation } from "../models/AssetClassAggregation";
import { InvestorSummary } from "../models/InvestorSummary";
import { InvestmentSummaryRepository } from "../repositories/InvestmentSummaryRepository";
import { InvestorsSummaryRepository } from "../repositories/InvestorsSummaryRepository";
import { IQueryHander } from "./IQueryHandler";

const investorSummaryRepository = new InvestorsSummaryRepository();
const investmentSummaryRepository = new InvestmentSummaryRepository();

export class GetInvestorSummaryQueryHandler implements IQueryHander<Query, Result> {
  public async handle(query: Query): Promise<Result> {
    const investorSummary = await investorSummaryRepository.GetInvestorSummary(query.investorId);
    if (investorSummary) {
      const assetClassAggregations = await investmentSummaryRepository.CalculateAssetClassAggregations(query.investorId);
      return {
        success: true,
        investorSummary,
        aggregations: {
          assetClass: assetClassAggregations,
        },
      };
    } else {
      return { success: false };
    }
  }
}

type Query = {
  investorId: string;
};

type Result =
  | {
      success: true;
      investorSummary: InvestorSummary;
      aggregations: { assetClass: AssetClassAggregation[] };
    }
  | { success: false };
