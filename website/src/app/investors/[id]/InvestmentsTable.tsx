import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { PostInvestmentsSearchResponseBody } from "@/hooks/types";
import numeral from "numeral";
import Skeleton from "react-loading-skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../components/ui/tooltip";

type Args = {
  data?: PostInvestmentsSearchResponseBody;
  isLoading: boolean;
  pageOffset: number;
  pageSize: number;
  onNext: () => void;
  onPrevious: () => void;
  totalCount: number;
};

export default function InvestorsTable({ data, isLoading, pageOffset, pageSize, totalCount, onNext, onPrevious }: Args) {
  return (
    <div>
      <Table>
        <TableCaption>{isLoading ? "Loading... " : `Showing ${data?.results.length} items of ${data?.paging.totalCount}`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Id</TableHead>
            <TableHead>Asset Class</TableHead>
            <TableHead className="w-[100px]">Currency</TableHead>
            <TableHead className="w-[100px] text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <>
              <BuildSkeletonRow />
              <BuildSkeletonRow />
              <BuildSkeletonRow />
              <BuildSkeletonRow />
            </>
          )}
          {!isLoading &&
            data?.results.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.assetClass}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell className="text-right">
                  <Tooltip>
                    <TooltipTrigger>{numeral(item.amount).format("0.0a")}</TooltipTrigger>
                    <TooltipContent>
                      <p>{item.amount}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (pageOffset > 0) {
                  onPrevious();
                }
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                const nextPageStart = (pageOffset + 1) * pageSize;
                if (nextPageStart < totalCount) {
                  onNext();
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
function BuildSkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
    </TableRow>
  );
}
