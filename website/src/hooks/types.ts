export type GetDashboardResponseBody = {
  investors: {
    id: string;
    name: string;
    type: string;
    dateAdded: Date;
    lastUpdated: Date;
    totalCommitments: number;
  }[];
};
