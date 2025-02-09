import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostInvestmentsSearchRequestBody, PostInvestmentsSearchResponseBody } from "@/hooks/types";

async function fetchInvestments(args: { investorId: string; pageOffset: number; pageSize: number }): Promise<PostInvestmentsSearchResponseBody> {
  const url = new URL("/v1/investments/search", process.env.NEXT_PUBLIC_BFF_BASE_URL).href;
  const data: PostInvestmentsSearchRequestBody = {
    investorIds: [args.investorId],
    paging: {
      pageSize: args.pageSize,
      pageOffset: args.pageOffset,
    },
  };
  const response = await axios<PostInvestmentsSearchResponseBody>({
    method: "post",
    url,
    data,
  });
  return response.data;
}

export function useInvestmentsData(args: { investorId: string; pageOffset: number; pageSize: number }) {
  const key = JSON.stringify(args);
  return useQuery({
    queryKey: [key],
    queryFn: () => fetchInvestments({ investorId: args.investorId, pageOffset: args.pageOffset, pageSize: args.pageSize }),
  });
}
