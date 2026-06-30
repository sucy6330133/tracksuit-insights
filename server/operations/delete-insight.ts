import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";
import { deleteStatement } from "$tables/insights.ts";

// 1. Define the Input type, extending the DB client with the required fields
type Input = HasDBClient & {
  id: number;
};

export default (input: Input): Insight => {
  console.log(`Delete insight for id=${input.id}`);

  const rawSqlString = deleteStatement(input.id); 
  const statement = input.db.prepare(rawSqlString);

  try {
    statement.run()
    console.log(`Insight with id=${input.id} deleted successfully.`);
  } catch (error) {
    console.error("Failed to delete insight:", error);
    throw new Error(`Failed to delete insight with id=${input.id}: ${error}`);
  } finally {
    statement.finalize();
  }
};