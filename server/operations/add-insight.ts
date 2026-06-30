import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";
import { insertStatement } from "$tables/insights.ts";

// 1. Define the Input type, extending the DB client with the required fields
type Input = HasDBClient & {
  brand: number;
  text: string;
};

export default (input: Input): Insight => {
  const createdAtStr = new Date().toISOString();

  console.log(`Adding new insight for brand=${input.brand}`);

  // 2. Construct the raw SQL string using their helper function
  const rawSqlString = insertStatement({
    brand: input.brand,
    createdAt: createdAtStr,
    text: input.text,
  });

  const fullSqlWithReturning = `${rawSqlString} RETURNING *`;
  console.log(`Executing SQL: ${fullSqlWithReturning}`);

  const statement = input.db.prepare(fullSqlWithReturning);
  const row = statement.get<insightsTable.Row>();

  statement.finalize();

  if (!row) {
    throw new Error("Failed to insert insight row into database.");
  }

  const result = { ...row, createdAt: new Date(row.createdAt) };
  console.log("Insight added successfully:", result);

  return result;
};
