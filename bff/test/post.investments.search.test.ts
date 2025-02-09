jest.mock("../Configuration", () => ({
  configuration: {
    ORIGIN: "localhost",
  },
}));

const mockQuery = jest.fn();

jest.mock("mysql2/promise", () => ({
  createConnection: jest.fn(() => ({
    connect: jest.fn(),
    query: mockQuery,
    end: jest.fn(),
  })),
}));

import app from "../App";
import supertest from "supertest";
import http from "http";

describe("dashboard", () => {
  let server: any;

  beforeEach((done) => {
    jest.clearAllMocks();
    mockQuery.mockReset();
    server = http.createServer(app.callback());
    server.listen(done);
  });

  afterEach(() => {
    server.close();
  });

  it("returns 200 OK with the correct payload for a default search", async () => {
    mockQuery.mockImplementationOnce(async () => [[BuildInvestmentSummaryRow(1, "investor-1"), BuildInvestmentSummaryRow(2, "investor-1")]]);
    mockQuery.mockImplementationOnce(async () => [[{ totalCount: 123 }]]);

    const response = await supertest(app.callback()).post("/v1/investments/search").send({});

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      results: [
        {
          amount: 12.34,
          assetClass: "Asset Class 1",
          currency: "GBP",
          id: "id-1",
          investorId: "investor-1",
        },
        {
          amount: 24.68,
          assetClass: "Asset Class 2",
          currency: "GBP",
          id: "id-2",
          investorId: "investor-1",
        },
      ],
      paging: {
        totalCount: 123,
        pageSize: 15,
        pageOffset: 0,
      },
    });
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenNthCalledWith(1, {
      sql: "SELECT id, investor_id, asset_class, amount, currency FROM investments_summary OFFSET ? LIMIT ?",
      values: [0, 15],
    });
    expect(mockQuery).toHaveBeenNthCalledWith(2, {
      sql: "SELECT COUNT(*) AS totalCount FROM (SELECT id, investor_id, asset_class, amount, currency FROM investments_summary) AS subquery",
      values: [],
    });
  });

  it("returns 200 OK with the correct payload for a list of investorIds search", async () => {
    mockQuery.mockImplementationOnce(async () => [[BuildInvestmentSummaryRow(1, "investor-1")]]);
    mockQuery.mockImplementationOnce(async () => [[{ totalCount: 123 }]]);

    const response = await supertest(app.callback())
      .post("/v1/investments/search")
      .send({
        investorIds: ["investor-1"],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      results: [
        {
          amount: 12.34,
          assetClass: "Asset Class 1",
          currency: "GBP",
          id: "id-1",
          investorId: "investor-1",
        },
      ],
      paging: {
        totalCount: 123,
        pageSize: 15,
        pageOffset: 0,
      },
    });
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenNthCalledWith(1, {
      sql: "SELECT id, investor_id, asset_class, amount, currency FROM investments_summary WHERE investor_id IN (?) OFFSET ? LIMIT ?",
      values: [["investor-1"], 0, 15],
    });
    expect(mockQuery).toHaveBeenNthCalledWith(2, {
      sql: "SELECT COUNT(*) AS totalCount FROM (SELECT id, investor_id, asset_class, amount, currency FROM investments_summary WHERE investor_id IN (?)) AS subquery",
      values: [["investor-1"]],
    });
  });
});

function BuildInvestmentSummaryRow(seed: number, investorId: string) {
  return {
    id: `id-${seed}`,
    investor_id: investorId,
    asset_class: `Asset Class ${seed}`,
    amount: seed * 12.34,
    currency: `GBP`,
  };
}

export {};
