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
    mockQuery.mockImplementationOnce(async () => [[BuildInvestorSummaryRow(1)]]);
    mockQuery.mockImplementationOnce(async () => [[BuildAggregateRow(1), BuildAggregateRow(2)]]);

    const response = await supertest(app.callback()).get("/v1/investors/example-id").send({});

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      dateAdded: "2020-01-02T03:04:05.678Z",
      id: "id-1",
      lastUpdated: "2021-01-02T03:04:05.678Z",
      name: "Example Name 1",
      summaries: {
        assets: [
          {
            amount: 100,
            name: "Asset Class 1",
          },
          {
            amount: 200,
            name: "Asset Class 2",
          },
        ],
      },
      totalCommitments: 1000,
      type: "Example Type 1",
    });
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenNthCalledWith(1, {
      sql: "SELECT id, name, type, country, commitments_total, date_added, last_updated FROM investors_summary WHERE id = ?",
      values: ["example-id"],
    });
    expect(mockQuery).toHaveBeenNthCalledWith(2, {
      sql: "SELECT asset_class, SUM(amount) AS total_amount FROM investments_summary WHERE investor_id = ? GROUP BY investor_id, asset_class",
      values: ["example-id"],
    });
  });
});

function BuildInvestorSummaryRow(seed: number) {
  return {
    id: `id-${seed}`,
    name: `Example Name ${seed}`,
    type: `Example Type ${seed}`,
    commitments_total: seed * 1000,
    country: `example-country-${seed}`,
    date_added: new Date("2020-01-02T03:04:05.678Z"),
    last_updated: new Date("2021-01-02T03:04:05.678Z"),
  };
}

function BuildAggregateRow(seed: number) {
  return {
    asset_class: `Asset Class ${seed}`,
    total_amount: 100 * seed,
  };
}

export {};
