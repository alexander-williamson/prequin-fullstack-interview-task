import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetInvestorsResponseBody } from "./types";

async function fetchInvestor({ investorId }: { investorId: string }): Promise<GetInvestorsResponseBody> {
  const url = new URL(`/v1/investors/${investorId}`, process.env.NEXT_PUBLIC_BFF_BASE_URL).href;
  const response = await axios<GetInvestorsResponseBody>({ url });
  return response.data;
}

export function useInvestorData({ investorId }: { investorId: string }) {
  return useQuery({
    queryKey: ["investor", investorId],
    queryFn: () => fetchInvestor({ investorId }),
  });
}
