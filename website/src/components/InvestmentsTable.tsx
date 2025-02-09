import { GetDashboardResponseBody } from "@/hooks/types";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import moment from "moment";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import numeral from "numeral";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";

export default function InvestmentsTable({ data, isLoading }: { data?: GetDashboardResponseBody; isLoading: boolean }) {
  return (
    <Table>
      <TableCaption>{isLoading ? "Loading... " : `Showing ${data?.investors.length} items`}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead hidden={false} className="w-[100px]">
            Id
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date Added</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Amount</TableHead>
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
          data?.investors.map((item) => (
            <TableRow key={item.id}>
              <TableCell hidden={false}>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger>{moment(item.dateAdded).fromNow()}</TooltipTrigger>
                  <TooltipContent>
                    <p>{moment(item.dateAdded).format()}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger>{moment(item.lastUpdated).fromNow()}</TooltipTrigger>
                  <TooltipContent>
                    <p>{moment(item.lastUpdated).format()}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`investors/${item.id}/investments`}>
                  <Tooltip>
                    <TooltipTrigger>{numeral(item.totalCommitments).format("0.0a")}</TooltipTrigger>
                    <TooltipContent>
                      <p>{item.totalCommitments}</p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
function BuildSkeletonRow() {
  return (
    <TableRow>
      <TableCell hidden={false}></TableCell>
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
      <TableCell>
        <Skeleton />
      </TableCell>
    </TableRow>
  );
}
