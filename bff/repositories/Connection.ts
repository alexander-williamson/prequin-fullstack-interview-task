import mysql from "mysql2/promise";
import { configuration } from "../Configuration";

export interface IConnection {
  query<T>(params: { sql: string; values?: any[] }): Promise<T>;
}

export async function withConnection<T>(fn: (connection: IConnection) => Promise<T>): Promise<T> {
  const connection = await mysql.createConnection({
    host: configuration.DATABASE_HOST,
    user: configuration.DATABASE_USERNAME,
    password: configuration.DATABASE_PASSWORD,
    database: configuration.DATABASE_NAME,
  });

  try {
    connection.connect();
    return await fn({
      query: async <T>(params: { sql: string; values?: any }): Promise<T> => {
        // you must fetch out the rows at arr position [0]
        const [rows] = await connection.query({ sql: params.sql, values: params.values });
        return rows as T;
      },
    });
  } finally {
    connection.end();
  }
}
