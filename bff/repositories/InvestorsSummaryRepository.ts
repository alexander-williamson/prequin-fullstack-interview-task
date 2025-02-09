import { InvestorSummary } from "../models/InvestorSummary";
import { withConnection } from "./Connection";

export class InvestorsSummaryRepository {
  public async GetInvestorSummary(investorId: string): Promise<InvestorSummary | undefined> {
    return await withConnection(async (connection) => {
      const rows = await connection.query<InvestorsSummaryRow[]>({
        sql: "SELECT id, name, type, country, commitments_total, date_added, last_updated FROM investors_summary WHERE id = ?",
        values: [investorId],
      });
      const mapped: InvestorSummary[] = rows.map((row) => ({
        dateAdded: row.date_added,
        id: row.id,
        lastUpdated: row.last_updated,
        name: row.name,
        totalCommitments: row.commitments_total,
        type: row.type,
      }));
      return mapped[0];
    });
  }
  public async GetInvestorSummaries(): Promise<InvestorSummary[]> {
    return await withConnection(async (connection) => {
      const rows = await connection.query<InvestorsSummaryRow[]>({
        sql: "SELECT id, name, type, country, commitments_total, date_added, last_updated FROM investors_summary",
      });
      const mapped: InvestorSummary[] = rows.map((row) => ({
        dateAdded: row.date_added,
        id: row.id,
        lastUpdated: row.last_updated,
        name: row.name,
        totalCommitments: row.commitments_total,
        type: row.type,
      }));
      return mapped;
    });
  }
}

type InvestorsSummaryRow = {
  commitments_total: number;
  country: string;
  date_added: Date;
  id: string;
  last_updated: Date;
  name: string;
  type: string;
};
