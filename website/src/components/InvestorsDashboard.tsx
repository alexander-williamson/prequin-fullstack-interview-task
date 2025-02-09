"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import InvestmentsTable from "./InvestmentsTable";

export default function InvestorsDashboard() {
  const { isPending, error, data } = useDashboardData();
  return (
    <div>
      <h2>Investors Dashboard</h2>
      <InvestmentsTable data={data} isLoading={isPending} />
    </div>
  );
}
