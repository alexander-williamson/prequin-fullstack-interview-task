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
        sql: `${sql} OFFSET ? LIMIT ?`,
        values: [...values, args.pageOffset, args.pageSize],
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
}

type FindSummariesArgs = { investorIds?: string[]; pageOffset: number; pageSize: number };

type InvestorsSummaryRow = {
  id: string;
  investor_id: string;
  asset_class: string;
  amount: number;
  currency: string;
};
