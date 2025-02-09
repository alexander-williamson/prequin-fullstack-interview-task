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

export type PostInvestmentsSearchRequestBody = {
  investorIds?: string[];
  paging?: {
    pageOffset: number;
    pageSize: number;
  };
};

export type PostInvestmentsSearchResponseBody = {
  results: {
    id: string;
    investorId: string;
    assetClass: string;
    amount: number;
    currency: string;
  }[];
  paging: {
    pageOffset: number;
    pageSize: number;
    totalCount: number;
  };
};

export type GetInvestorsResponseBody = {
  id: string;
  name: string;
  type: string;
  dateAdded: Date;
  lastUpdated: Date;
  totalCommitments: number;
  summaries: {
    assets: { name: string; amount: number }[];
  };
};
