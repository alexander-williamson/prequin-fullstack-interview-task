jest.mock("../Configuration", () => ({
  configuration: {
    ORIGIN: "localhost",
  },
}));

const mockQuery = jest.fn().mockImplementation(async () => {
  let rows: any[] = [];
  return [rows];
});

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

  beforeAll((done) => {
    server = http.createServer(app.callback());
    server.listen(done);
  });

  test("returns 200 OK with the correct pauload", async () => {
    mockQuery.mockImplementation(async () => [[BuildInvestorSummaryRow(1), BuildInvestorSummaryRow(2)]]);

    const response = await supertest(app.callback()).get("/v1/dashboard");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      investors: [
        {
          dateAdded: "2020-01-02T03:04:05.678Z",
          id: "id-1",
          lastUpdated: "2021-01-02T03:04:05.678Z",
          name: "Example Name 1",
          totalCommitments: 1000,
          type: "Example Type 1",
        },
        {
          dateAdded: "2020-01-02T03:04:05.678Z",
          id: "id-2",
          lastUpdated: "2021-01-02T03:04:05.678Z",
          name: "Example Name 2",
          totalCommitments: 2000,
          type: "Example Type 2",
        },
      ],
    });
  });

  afterAll(() => {
    server.close();
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

export {};
