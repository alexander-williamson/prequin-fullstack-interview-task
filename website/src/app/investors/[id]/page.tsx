"use client";

import { useParams } from "next/navigation";
import InvestorCommitments from "./InvestorCommitments";

export default function InvestorById() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <InvestorCommitments investorId={id} />
    </div>
  );
}
