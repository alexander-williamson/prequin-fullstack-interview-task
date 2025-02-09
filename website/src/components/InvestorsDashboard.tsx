"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import InvestorsTable from "./InvestorsTable";

export default function InvestorsDashboard() {
  const { isPending, data } = useDashboardData();
  return (
    <div>
      <h2>Investors Dashboard</h2>
      <InvestorsTable data={data} isLoading={isPending} />
    </div>
  );
}
