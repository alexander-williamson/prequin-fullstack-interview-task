import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetDashboardResponseBody } from "./types";

const fetchDashboardData = async (): Promise<GetDashboardResponseBody> => {
  const url = new URL("/v1/dashboard", process.env.NEXT_PUBLIC_BFF_BASE_URL).href;
  const response = await axios.get<GetDashboardResponseBody>(url);
  return response.data;
};

export function useDashboardData() {
  return useQuery<GetDashboardResponseBody>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });
}
