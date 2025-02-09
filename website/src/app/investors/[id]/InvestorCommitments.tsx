import { useInvestmentsData } from "@/hooks/useInvestmentsData";
import { useInvestorData } from "@/hooks/useInvestorData";
import { useState } from "react";
import InvestmentsTable from "./InvestmentsTable";
import Summaries from "./Summaries";

export default function InvestorCommitments({ investorId }: { investorId: string }) {
  const [pageOffset, setPageOffset] = useState<number>(0);
  const pageSize = 10;
  const { data: investorData, isPending: investorIsPending } = useInvestorData({ investorId });
  const { data, isPending } = useInvestmentsData({ investorId, pageOffset, pageSize: 10 });
  return (
    <div>
      <h2>Investor Commitments</h2>
      <Summaries isLoading={investorIsPending} summaries={investorData?.summaries} />
      <InvestmentsTable
        isLoading={isPending}
        data={data}
        pageOffset={pageOffset}
        pageSize={pageSize}
        totalCount={data?.paging.totalCount ?? 0}
        onNext={() => setPageOffset(pageOffset + 1)}
        onPrevious={() => setPageOffset(pageOffset - 1)}
      />
    </div>
  );
}
