import { AssetClassAggregation } from "../models/AssetClassAggregation";
import { InvestmentSummary } from "../models/InvestmentSummary";
import { withConnection } from "./Connection";

export class InvestmentSummaryRepository {
  public async FindSummaries(args: FindSummariesArgs): Promise<{ results: InvestmentSummary[]; totalCount: number }> {
    return await withConnection(async (connection) => {
      const values: any[] = [];

      let sql = "SELECT id, investor_id, asset_class, amount, currency FROM investments_summary";
      if (args.investorIds) {
        sql += " WHERE investor_id IN (?)";
        values.push(args.investorIds);
      }

      const rows = await connection.query<InvestorsSummaryRow[]>({
        sql: `${sql} LIMIT ? OFFSET ?`,
        values: [...values, args.pageSize, args.pageOffset * args.pageSize],
      });

      const results: InvestmentSummary[] = rows.map((row) => ({
        amount: row.amount,
        assetClass: row.asset_class,
        currency: row.currency,
        id: row.id,
        investorId: row.investor_id,
      }));

      const countRows = await connection.query<{ totalCount: number }[]>({
        sql: `SELECT COUNT(*) AS totalCount FROM (${sql}) AS subquery`,
        values,
      });

      return {
        results,
        totalCount: countRows[0].totalCount,
      };
    });
  }

  public async CalculateAssetClassAggregations(investorId: string): Promise<AssetClassAggregation[]> {
    return await withConnection(async (connection) => {
      const rows = await connection.query<GroupRow[]>({
        sql: "SELECT asset_class, SUM(amount) AS total_amount FROM investments_summary WHERE investor_id = ? GROUP BY investor_id, asset_class",
        values: [investorId],
      });
      const mapped: AssetClassAggregation[] = rows.map((row) => ({
        assetClass: row.asset_class,
        totalAmount: row.total_amount,
      }));
      return mapped;
    });
  }
}

type FindSummariesArgs = { investorIds?: string[]; pageOffset: number; pageSize: number };

type InvestorsSummaryRow = {
  id: string;
  investor_id: string;
  asset_class: string;
  amount: number;
  currency: string;
};

type GroupRow = {
  asset_class: string;
  total_amount: number;
};
